import React, { ChangeEvent, useEffect, useState } from "react";
import type { DraftExpense } from "../types";
import { categories } from "../data/categories";
import DatePicker from 'react-date-picker';
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import ErrorMessage from "./ErrorMessage";
import { useBudget } from "../hooks/useBudget";

export default function ExpenseForm() {


    
    const [expense, setExpense] = useState<DraftExpense>({
        expenseName: '',
        amount: 0,
        category: '',
        date: new Date()
    });

    const [error, setError] = useState('');
    const [previousAmout, setPreviusAmount] = useState(0)
    const { dispatch,state,remainingBudget } = useBudget();
    useEffect(()=>{
        if(state.editingId ){
  const editingExpense = state.expenses.filter(expense=>expense.id === state.editingId)[0]
setExpense(editingExpense)
setPreviusAmount(editingExpense.amount)
 }
     },[state.editingId])

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
    
        // Convertir `value` a un número si el campo es `amount`
        const newValue = name === 'amount' ? parseFloat(value) : value;
    
        setExpense({
            ...expense,
            [name]: newValue
        });
    };

    const handleDateChange = (value: Date | Date[]) => {
        setExpense({
            ...expense,
            date: value instanceof Date ? value : (value[0] as Date)
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validar si algún campo está vacío
        if (Object.values(expense).some(value => value === '')) {
            setError('Todos los campos son obligatorios');
            return;
        }
        if ((expense.amount-previousAmout)>remainingBudget) {
            setError('El gasto supera el presupuesto');
            
            return;
        }
            //agregar o actualizar el gasto
            if(state.editingId){
                dispatch({type:'update-expense',payload:{expense:{id:state.editingId,...expense}}})
            }else{
                // Agregar la nueva expense mediante dispatch

                dispatch({ type: 'add-expense', payload: { expense } });
            }

        // Reiniciar el estado del formulario
        setExpense({
            expenseName: '',
            amount: 0,
            category: '',
            date: new Date()
        });
        setPreviusAmount(0)
    };

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            <legend className="uppercase text-center text-2xl font-black border-b-4 border-blue-500 py-2">
               {state.editingId ? 'Actualizar Gasto' : 'Agregar Gasto'}
            </legend>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <div className="flex flex-col gap-2">
                <label htmlFor="expenseName" className="text-xl">Nombre gasto:</label>
                <input
                    type="text"
                    id="expenseName"
                    className="p-2 border border-gray-300 rounded-lg"
                    placeholder="Nombre de gasto"
                    name="expenseName"
                    value={expense.expenseName}
                    onChange={handleChange}
                />
            </div>

            <div className="felx flex-col gap-2">
                <label htmlFor="amount" className="text-xl">Cantidad:</label>
                <input
                    type="number"
                    id="amount"
                    className="p-2 border border-gray-300 rounded-lg"
                    placeholder="Añadir cantidad del gasto ejemplo 100"
                    name="amount"
                    value={expense.amount}
                    onChange={handleChange}
                />
            </div>

            <div className="felx flex-col gap-2">
                <label htmlFor="category" className="text-xl">Categoría:</label>
                <select
                    id="category"
                    className="p-2 border border-gray-300 rounded-lg"
                    name="category"
                    value={expense.category}
                    onChange={handleChange}
                >
                    <option value="">Seleccionar categoría</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="felx flex-col gap-2">
                <label htmlFor="selectedDate" className="text-xl">Fecha Gasto:</label>
                <DatePicker
                    className="bg-slate-100 p-2 border-0"
                    value={expense.date}
                    onChange={handleDateChange}
                />
            </div>

            <input
                type="submit"
                className="bg-blue-600 cursor-pointer w-full p-2 text-white uppercase font-bold rounded-lg"
                value={state.editingId ? 'Actualizar Gasto' : 'Agregar Gasto'}
            />
        </form>
    );
}
