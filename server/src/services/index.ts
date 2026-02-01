import { Readable } from "stream";
import csv from "csv-parser";
import { USER_ID } from "../utils/constants";
import { formatToIso } from "../utils/date";
import { TransactionInsert } from "@expense-tracker/common";
import { saveTransactionList } from "@expense-tracker/common/supabase";

const formatter = new Intl.NumberFormat("sl-SI");

const parseExpenseListCsv = (csvString: String) => {
  return new Promise<TransactionInsert[]>((resolve, reject) => {
    const rows: TransactionInsert[] = [];

    const convertExpenseRow = (row: Record<string, string>) => {
      const amount = !isBlank(row["DOBRO"]) ? toNumber(row["DOBRO"]) : -toNumber(row["BREME"]);
      const type = !isBlank(row["DOBRO"]) ? "income" : "expense";
      const date = formatToIso(row["DATUM KNJIŽENJA"]);
      const currency = row["VALUTA"];
      const referrant = row["NAMEN"].trim();
      const newTransaction: TransactionInsert = {
        amount: amount,
        type: type,
        date: date,
        currency: currency,
        referrent: referrant,
        description: null,
        user_id: USER_ID,
        category_id: null,
      };
      rows.push(newTransaction);
    };

    Readable.from(csvString)
      .pipe(csv({ separator: ";" }))
      .on("data", (row) => convertExpenseRow(row))
      .on("end", () => resolve(rows))
      .on("error", (error) => reject(error));
  });
};

export const processTransactions = async (transactionsCsv: string) => {
  try {
    const transactions = await parseExpenseListCsv(transactionsCsv);
    await saveTransactionList(transactions);
  } catch (e) {
    throw e;
  }
};

const isBlank = (s: string | null | undefined) => s == null || s.trim().length === 0;

const toNumber = (s: string) => Number(s.replace(/\./g, "").replace(",", "."));
