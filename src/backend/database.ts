import { enablePromise, openDatabase, ResultSet, SQLiteDatabase } from "react-native-sqlite-storage";

enablePromise(true);

export type Stocks = {
    rowid?: number;
    pid: string;
    pname: string;
    qty: number

}

export const dbCon = async (): Promise<SQLiteDatabase> | never => {
    try {
        return await openDatabase({ name: "store.db", location: "default" })
    } catch (error) {
        console.log(error);
        throw Error("connection failed")
    }
}

export const createStockTable = async (db: SQLiteDatabase): Promise<boolean> | never => {
    const query = `CREATE TABLE IF NOT EXISTS stocks(
        pid TEXT PRIMARY KEY,
        pname TEXT NOT NULL,
        qty INT CHECK(qty > 0)
    )`
    try {
        await db.executeSql(query)
        return true
    } catch (error) {
        console.log(error)
        throw Error("failed to add data");
    }
}

export const getStocksData = async (db: SQLiteDatabase): Promise<Stocks[]> | never => {
    try {
        const data: Stocks[] = [];
        const query = 'SELECT rowid,* from stocks';
        const results = await db.executeSql(query);

        results.forEach((result) => {
            for (let index = 0; index < result.rows.length; index++) {
                data.push(result.rows.item(index))
            }
        })

        return data;

    } catch (error) {
        console.log(error);
        throw Error("failed to fetch stock data");
    }
}

export const saveStocks = async (db: SQLiteDatabase, data: Stocks[]) => {
    try {
        const insertQuery =
            `INSERT OR REPLACE INTO stocks(pid,pname,qty) values` +
            data.map(i => `(${i.pid},'${i.pname}','${i.qty}')`).join(',');
        return await db.executeSql(insertQuery);
    } catch (error) {
        console.log(error);
        
    }

};

export const deleteStock = async (db: SQLiteDatabase, id: string): Promise<[ResultSet]> | never => {
    const query = `DELETE FROM stocks WHERE pid=${id}`
    try {
        return await db.executeSql(query);
    } catch (error) {
        console.log(error);
        throw Error("failed to delete data")
    }
}