export type Expense = {
    id: string
    expenseName: string
    amount: number
    category: string
    date: Value
}
export type DraftExpense = Omit<Expense, 'id'>
type ValuePice = Date| null;
export type Value = ValuePice |[ValuePice,ValuePice];
export type Category = {
    id: string
    name: string
    icon: string
}