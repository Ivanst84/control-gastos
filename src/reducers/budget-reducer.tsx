import { Category, DraftExpense, Expense } from "../types"
import {v4 as uuidv4} from 'uuid'
export type BudgetActions =
    { type: 'add-budget', payload: { budget: number } } |
    { type: 'show-modal' }|
    { type: 'hide-modal' }|
    {type:'add-expense',payload:{expense:DraftExpense}}|
    {type:'delete-expense',payload:{id:string}}|
    { type: 'get-expense-by-id', payload: {id: Expense['id'] } } |
    {type:'update-expense',payload:{expense:Expense}}|
    {type:'reset'}|
    {type:'add-filter-category',payload:{id:Category['id']}}

export type BudgetState = {
    budget: number
    modal: boolean
    editingId: Expense['id']
    expenses: Expense[],
    currentCategory:Category['id']
}
const localStorageExpenses = ():Expense[] =>{
    const localStorageExpenses = localStorage.getItem('expenses')
    return localStorageExpenses ? JSON.parse(localStorageExpenses):[]
}
const initialBudget = (): number=>{
    const localStorageBudget=localStorage.getItem('budget')
    return localStorageBudget ?+localStorageBudget:0
}
export const initialState: BudgetState = {
    budget: initialBudget(),
    modal: false,
    expenses: localStorageExpenses(),
   editingId:'',
   currentCategory:''
}
const createExpense = (draftExpense:DraftExpense):Expense => {
   return{
    ...draftExpense,
    id:uuidv4()
   }
}
export const budgetReducer = (
    state: BudgetState = initialState,
    action: BudgetActions
) => {
    if (action.type === 'add-budget') {
        return {
            ...state,
            budget: action.payload.budget
        }


    }
    if (action.type === 'show-modal') {
        return {
            ...state,
            modal: true
        }
        
    }
    if (action.type === 'hide-modal') {
        return {
            ...state,
            modal: false,
            editingId:''
        }
        
    }
    if (action.type === 'add-expense') {
      const expense = createExpense(action.payload.expense)
        return {
            ...state,
          expenses:[...state.expenses,expense],
          modal:false
        }
        
    }
    if (action.type === 'delete-expense') {
        return {
            ...state,
          expenses:state.expenses.filter(expense=>expense.id!==action.payload.id)
        }
        
    }
    if (action.type === 'update-expense') {
        const updatedExpense = action.payload.expense;
        const updatedExpenses = state.expenses.map(expense =>
          expense.id === updatedExpense.id ? updatedExpense : expense
        );
        return {
          ...state,
          expenses: updatedExpenses,
          modal:false,
          editingId:''
        };
      }
      if(action.type === 'get-expense-by-id'){
        return {
            ...state,
            editingId: action.payload.id,
            modal:true
        }
    }
    if(action.type === 'reset'){
        localStorage.removeItem('budget'); // Limpiar el Local Storage del presupuesto
        localStorage.removeItem('expenses'); // Limpiar el Local Storage de los gastos
        //refrescar ventana
        return initialState; // Devolver el estado inicial
    }
    if(action.type === 'add-filter-category'){
return{
       ...state,
       currentCategory:action.payload.id
    }
}
    return state
}	