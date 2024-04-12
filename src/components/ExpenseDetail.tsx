import { Expense } from '../types'
import { formatDate } from '../helpers'
import AmountDisplay from './AmountDisplay'
import { categories } from '../data/categories'
import { LeadingActions,
    SwipeableListItem,
    TrailingActions,
    SwipeAction,
    SwipeableList
 } from 'react-swipeable-list'
 import 'react-swipeable-list/dist/styles.css'
 import { useBudget } from '../hooks/useBudget'
import { useMemo } from 'react'
type ExpenseDetailProps = {
    expense: Expense
    }
    
    
    export default function ExpenseDetail({expense}: ExpenseDetailProps) {
   
        const{dispatch} = useBudget()
      
        const categoryInfo = useMemo(() => categories.find(cat => cat.id === expense.category) || {}, [expense]);
    const leadingActions =() =>(
        <LeadingActions>
            <SwipeAction
                onClick={() => dispatch({type: 'get-expense-by-id', payload: {id: expense.id}})}                        background-color='#f44336'
            >
                Actualizar
            </SwipeAction>
        </LeadingActions>
    )
    const trailingActions =() =>(
        <TrailingActions>
            <SwipeAction
            onClick={()=>dispatch({type:'delete-expense',payload:{id:expense.id}})}
            background-color='#f44336'
            destructive={true}
            >
                Eliminar
            </SwipeAction>
        </TrailingActions>
    )
    return (
    <SwipeableList>
        <SwipeableListItem
        maxSwipe={1}
        leadingActions={leadingActions()}
        trailingActions={trailingActions()}
        >
    <div className='bg-white shadow-lg p-10 w-full border-b border-gray-200 flex gap-5 items-center'>

        <div>
        <img 
        src={`/icono_${(categoryInfo as { icon: string }).icon}.svg`}
        alt="icono gasto"
        className='w-12 h-12 bg-blue-100 p-2 rounded-full text-blue-600'
        />
        </div>
        <div className='flex-1 space-y-2'>
            <p className='text-sm font-bold uppercase text-slate-500'>{(categoryInfo as { name: string }).name}</p>
            <p>{expense.expenseName}</p>
            <p className='text-slate-600 text-sm'>{formatDate(expense.date!.toString())}</p>
        </div>
        <AmountDisplay
        amount ={expense.amount}
        />
    </div>
    </SwipeableListItem>
    </SwipeableList>
  )
}
