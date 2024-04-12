import { useMemo, useState} from 'react'
import { useBudget } from '../hooks/useBudget'
export default function BudgetForm() {
    const [budget,setBudget] = useState(0)
    const {dispatch} = useBudget()


    const handleChange =(e:React.ChangeEvent<HTMLInputElement>)=>{
        setBudget(parseInt(e.target.value)) 
   }
   const isValid = useMemo(()=>{
return isNaN(budget) || budget <= 0
   },[budget])
   const handleSubmit =(e:React.FormEvent<HTMLFormElement>)=>{
      e.preventDefault()
      dispatch({type:'add-budget',payload:{budget}})
   }
  return (
     <form className ="space-y-5" onSubmit={handleSubmit}>
        <div className='flex flex-col space-y-5'>
           <label htmlFor="budget" className="text-4xl text-blue-600 font-bold text-center">
            Define presupuesto
            </label>
            <input
                type="number"
                className="w-full bg-white border bordger-gray-200 p-2"
                placeholder="Ej. 3000"
                id="budget"
                name ="budget"
                value={budget}
onChange={handleChange}                 />
            </div>
            <input
            type="submit"
            value="Definir Presupuesto"
            className='bg-blue-600 w-full p-2
             text-white uppercase font-bold
              hover:bg-blue-700 cursor-pointer disabled:opacity-40'
              disabled={isValid}
              />
     </form>
  )
}
