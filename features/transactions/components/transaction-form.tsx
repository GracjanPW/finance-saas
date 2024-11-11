import {z} from "zod"
import { Trash } from "lucide-react" 
import { useForm } from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { insertTransactionSchema } from "@/db/schema"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,

} from "@/components/ui/form"
import { Select } from "@/components/select"
import { DatePicker } from "@/components/date-picker"
import { Textarea } from "@/components/ui/textarea"
import { AmountInput } from "@/components/amount-input"
import { convertAmountToMiliUnits } from "@/lib/utils"

const formSchema = z.object({
  date:z.coerce.date(),
  accountId:z.string(),
  categoryId:z.string().nullable().optional(),
  payee:z.string(),
  amount:z.string(),
  notes:z.string().nullable().optional(),
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const apiSchema = insertTransactionSchema.omit({
  id:true
})

type FormValues = z.input<typeof formSchema>;
type ApiFormValues =  z.input<typeof apiSchema>;

type Props = {
  id?:string;
  defaultValues?: FormValues;
  categoryOptions:{label:string, value:string}[];
  accountOptions:{label:string, value:string}[];
  disabled?:boolean
  onSubmit:(values:ApiFormValues)=>void;
  onCreateAccount:(name:string)=>void
  onCreateCategory:(name:string)=>void
  onDelete?:()=>void;
}

export const TransactionForm = ({
  id,
  defaultValues,
  disabled,
  accountOptions,
  categoryOptions,
  onCreateAccount,
  onCreateCategory,
  onSubmit,
  onDelete,
}:Props) =>{
  const form = useForm<FormValues>({
    resolver:zodResolver(formSchema),
    defaultValues: defaultValues,
  })

  const handleSubmit = (values:FormValues) =>{
    const amount = parseFloat(values.amount)
    const amountInMili = convertAmountToMiliUnits(amount)

    onSubmit({
      ...values,
      amount:amountInMili
    })
  }
  
  const handleDelete = () =>{
    onDelete?.();
  }
  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 pt-4"
      >
        <FormField
          name="date"
          control={form.control}
          render={({field})=>(
            <FormItem>
              <FormControl>
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="accountId"
          control={form.control}
          render={({field})=>(
            <FormItem>
              <FormLabel>
                Account
              </FormLabel>
              <FormControl>
                <Select 
                  placeholder="Select an account"
                  options={accountOptions}
                  onCreate={onCreateAccount}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="categoryId"
          control={form.control}
          render={({field})=>(
            <FormItem>
              <FormLabel>
                Category
              </FormLabel>
              <FormControl>
                <Select 
                  placeholder="Select a category"
                  options={categoryOptions}
                  onCreate={onCreateCategory}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="payee"
          control={form.control}
          render={({field})=>(
            <FormItem>
              <FormLabel>
                Payee
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Add a payee"
                  disabled={disabled}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="amount"
          control={form.control}
          render={({field})=>(
            <FormItem>
              <FormLabel>
                Amount
              </FormLabel>
              <FormControl>
                <AmountInput 
                  {...field}
                  placeholder="0.00"
                  disabled={disabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="notes"
          control={form.control}
          
          render={({field})=>(
            <FormItem>
              <FormLabel>
                Notes
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value??""}
                  placeholder="Optional notes"
                  disabled={disabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="w-full" disabled={disabled}>
          {id?"Save changes":"Add transaction"}
        </Button>
        {!!id && <Button type="button"
          disabled={disabled}
          onClick={handleDelete} 
          className="w-full" 
          variant={'outline'}
        >
          <Trash className="size-4 mr-2"/>
          Delete account
        </Button>}
      </form>
    </Form>
  )
}