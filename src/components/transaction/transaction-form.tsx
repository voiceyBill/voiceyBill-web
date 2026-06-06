import * as z from "zod";
import { useEffect, useState } from "react";
import { Calendar, Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { getFlagUrl } from "@/lib/currency-flag";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import RecieptScanner from "./reciept-scanner";
import VoiceRecorder from "./voice-recorder";
import {
  _TRANSACTION_FREQUENCY,
  _TRANSACTION_TYPE,
  CATEGORIES,
  PAYMENT_METHODS,
} from "@/constant";
import { Switch } from "../ui/switch";
import CurrencyInputField from "../ui/currency-input";
import { SingleSelector } from "../ui/single-select";
import { AIScanReceiptData } from "@/features/transaction/transationType";
import {
  useCreateTransactionMutation,
  useGetSingleTransactionQuery,
  useUpdateTransactionMutation,
} from "@/features/transaction/transactionAPI";
import { toast } from "sonner";
import { useTypedSelector } from "@/app/hook";
import { useGetSupportedCurrenciesQuery } from "@/features/currency/currencyAPI";
import { ALL_CURRENCIES } from "@/constants/currencies";

const formSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, { message: "Title must be at least 2 characters." }),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number.",
  }),
  type: z.enum([_TRANSACTION_TYPE.INCOME, _TRANSACTION_TYPE.EXPENSE]),
  category: z.string().min(1, { message: "Please select a category." }),
  date: z.date({
    required_error: "Please select a date.",
  }),
  paymentMethod: z
    .string()
    .min(1, { message: "Please select a payment method." }),
  isRecurring: z.boolean(),
  frequency: z
    .enum([
      _TRANSACTION_FREQUENCY.DAILY,
      _TRANSACTION_FREQUENCY.WEEKLY,
      _TRANSACTION_FREQUENCY.MONTHLY,
      _TRANSACTION_FREQUENCY.YEARLY,
    ])
    .nullable()
    .optional(),
  description: z.string().optional(),
  receiptUrl: z.string().optional(),
  currency: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const TransactionForm = (props: {
  isEdit?: boolean;
  transactionId?: string;
  onCloseDrawer?: () => void;
  mode?: "manual" | "scan" | "voice";
}) => {
  const {
    onCloseDrawer,
    isEdit = false,
    transactionId,
    mode = "voice",
  } = props;

  const [isScanning, setIsScanning] = useState(false);
  const { user } = useTypedSelector((state) => state.auth);
  const baseCurrency = user?.baseCurrency || "USD";
  const { data: currencyData } = useGetSupportedCurrenciesQuery();

  const { data, isLoading } = useGetSingleTransactionQuery(
    transactionId || "",
    { skip: !transactionId },
  );
  const editData = data?.transaction;

  const [createTransaction, { isLoading: isCreating }] =
    useCreateTransactionMutation();

  const [updateTransaction, { isLoading: isUpdating }] =
    useUpdateTransactionMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      amount: "",
      type: _TRANSACTION_TYPE.INCOME,
      category: "",
      date: new Date(),
      paymentMethod: "",
      isRecurring: false,
      frequency: null,
      description: "",
      receiptUrl: "",
      currency: baseCurrency,
    },
  });

  useEffect(() => {
    if (isEdit && transactionId && editData) {
      const editAmount =
        editData.originalAmount != null
          ? editData.originalAmount.toString()
          : editData.amount.toString();
      const editCurrency = editData.originalCurrency || baseCurrency;

      form.reset({
        title: editData?.title,
        amount: editAmount,
        type: editData.type,
        category: editData.category?.toLowerCase(),
        date: new Date(editData.date),
        paymentMethod: editData.paymentMethod,
        isRecurring: editData.isRecurring,
        frequency: editData.recurringInterval,
        description: editData.description,
        currency: editCurrency,
      });
    }
  }, [baseCurrency, editData, form, isEdit, transactionId]);

  const frequencyOptions = Object.entries(_TRANSACTION_FREQUENCY).map(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ([_, value]) => ({
      value: value,
      label: value.replace("_", " ").toLowerCase(),
    }),
  );

  const handleScanComplete = (data: AIScanReceiptData) => {
    let transactionType: z.infer<typeof formSchema>["type"] =
      _TRANSACTION_TYPE.EXPENSE;
    if (data.type) {
      const typeUpper = data.type.toUpperCase();

      if (typeUpper === _TRANSACTION_TYPE.INCOME) {
        transactionType = _TRANSACTION_TYPE.INCOME as z.infer<
          typeof formSchema
        >["type"];
      } else if (typeUpper === _TRANSACTION_TYPE.EXPENSE) {
        transactionType = _TRANSACTION_TYPE.EXPENSE as z.infer<
          typeof formSchema
        >["type"];
      }
    }

    form.reset({
      ...form.getValues(),
      title: data.title || "",
      amount: data.amount?.toString() || "",
      type: transactionType,
      category: data.category?.toLowerCase() || "",
      date: data.date ? new Date(data.date) : new Date(),
      paymentMethod: data.paymentMethod || "",
      isRecurring: false,
      frequency: null,
      description: data.description || "",
      receiptUrl: data.receiptUrl || "",
      currency: data.currency || baseCurrency,
    });
  };

  const onSubmit = (values: FormValues) => {
    const localDate = new Date(values.date);
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, "0");
    const day = String(localDate.getDate()).padStart(2, "0");
    const localDateString = `${year}-${month}-${day}T00:00:00.000Z`;

    const payload = {
      title: values.title,
      type: values.type,
      category: values.category,
      paymentMethod: values.paymentMethod,
      description: values.description || "",
      amount: Number(values.amount),
      date: localDateString,
      isRecurring: values.isRecurring || false,
      recurringInterval: values.frequency || null,
      currency: values.currency !== baseCurrency ? values.currency : undefined,
    };
    if (isEdit && transactionId) {
      updateTransaction({ id: transactionId, transaction: payload })
        .unwrap()
        .then(() => {
          onCloseDrawer?.();
          toast.success("Transaction updated successfully");
        })
        .catch((error) => {
          toast.error(error.data.message || "Failed to update transaction");
        });
      return;
    }
    createTransaction(payload)
      .unwrap()
      .then(() => {
        form.reset();
        onCloseDrawer?.();
        toast.success("Transaction created successfully");
      })
      .catch((error) => {
        toast.error(error.data.message || "Failed to create transaction");
      });
  };

  return (
    <div className="relative">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col h-full"
        >
          <div className="flex-1 px-2.5 pt-5 space-y-4">
            {!isEdit && mode === "scan" && (
              <RecieptScanner
                loadingChange={isScanning}
                onLoadingChange={setIsScanning}
                onScanComplete={handleScanComplete}
              />
            )}

            {!isEdit && mode === "voice" && (
              <VoiceRecorder
                loadingChange={isScanning}
                onLoadingChange={setIsScanning}
                onVoiceComplete={handleScanComplete}
              />
            )}

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Transaction Type</FormLabel>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex space-x-2"
                    disabled={isScanning}
                  >
                    <label
                      htmlFor={_TRANSACTION_TYPE.INCOME}
                      className={cn(
                        `text-sm font-normal leading-none cursor-pointer
                        flex items-center space-x-2 rounded-md
                        shadow-sm border p-2 flex-1 justify-center
                        `,
                        field.value === _TRANSACTION_TYPE.INCOME &&
                          "!border-primary",
                      )}
                    >
                      <RadioGroupItem
                        value={_TRANSACTION_TYPE.INCOME}
                        id={_TRANSACTION_TYPE.INCOME}
                        className="!border-primary"
                      />
                      Income
                    </label>

                    <label
                      htmlFor={_TRANSACTION_TYPE.EXPENSE}
                      className={cn(
                        `text-sm font-normal leading-none cursor-pointer
                        flex items-center space-x-2 rounded-md
                        shadow-sm border p-2 flex-1 justify-center
                        `,
                        field.value === _TRANSACTION_TYPE.EXPENSE &&
                          "!border-primary",
                      )}
                    >
                      <RadioGroupItem
                        value={_TRANSACTION_TYPE.EXPENSE}
                        id={_TRANSACTION_TYPE.EXPENSE}
                        className="!border-primary"
                      />
                      Expense
                    </label>
                  </RadioGroup>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="!font-normal">Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Transaction title"
                      {...field}
                      disabled={isScanning}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Amount + Currency */}
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <CurrencyInputField
                          {...field}
                          disabled={isScanning}
                          onValueChange={(value) => field.onChange(value || "")}
                          placeholder="0.00"
                          prefix={
                            currencyData?.currencies?.find(
                              (c) => c.code === form.watch("currency"),
                            )?.symbol ??
                            new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: form.watch("currency") || baseCurrency,
                              maximumFractionDigits: 0,
                            })
                              .formatToParts(0)
                              .find((p) => p.type === "currency")?.value ??
                            "$"
                          }
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem className="w-[120px]">
                    <FormLabel>Currency</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isScanning}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="USD">
                            {field.value && (
                              <span className="flex items-center gap-2">
                                {(() => {
                                  const flagUrl = getFlagUrl(field.value);
                                  const currency = (
                                    currencyData?.currencies &&
                                    currencyData.currencies.length > 0
                                      ? currencyData.currencies
                                      : ALL_CURRENCIES
                                  ).find((c) => c.code === field.value);
                                  return (
                                    <>
                                      {flagUrl && (
                                        <img
                                          src={flagUrl}
                                          alt={field.value}
                                          className="h-3 w-4.5 rounded-sm object-cover shrink-0"
                                        />
                                      )}
                                      <span>
                                        {currency
                                          ? `${currency.symbol} ${currency.code}`
                                          : field.value}
                                      </span>
                                    </>
                                  );
                                })()}
                              </span>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(currencyData?.currencies &&
                        currencyData.currencies.length > 0
                          ? currencyData.currencies
                          : ALL_CURRENCIES
                        ).map((c) => {
                          const flagUrl = getFlagUrl(c.code);
                          return (
                            <SelectItem key={c.code} value={c.code}>
                              <span className="flex items-center gap-2">
                                {flagUrl && (
                                  <img
                                    src={flagUrl}
                                    alt={c.code}
                                    className="h-3 w-4.5 rounded-sm object-cover shrink-0"
                                  />
                                )}
                                <span>
                                  {c.symbol} {c.code}
                                </span>
                              </span>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <SingleSelector
                    value={
                      CATEGORIES.find((opt) => opt.value === field.value) ||
                      field.value
                        ? { value: field.value, label: field.value }
                        : undefined
                    }
                    onChange={(option) => field.onChange(option.value)}
                    options={CATEGORIES}
                    placeholder="Select or type a category"
                    creatable
                    disabled={isScanning}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover modal={false}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <Calendar className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 !pointer-events-auto"
                      align="start"
                    >
                      <CalendarComponent
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date); // This updates the form value
                        }}
                        disabled={(date) => date < new Date("2023-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Payment Method */}
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isScanning}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PAYMENT_METHODS.map((method) => (
                        <SelectItem key={method.value} value={method.value}>
                          {method.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isRecurring"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-[14.5px]">
                      Recurring Transaction
                    </FormLabel>
                    <p className="text-xs text-muted-foreground">
                      {field.value
                        ? "This will repeat automatically"
                        : "Set recurring to repeat this transaction"}
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      disabled={isScanning}
                      checked={field.value}
                      className="cursor-pointer"
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        if (checked) {
                          form.setValue(
                            "frequency",
                            _TRANSACTION_FREQUENCY.DAILY,
                          );
                        } else {
                          form.setValue("frequency", null);
                        }
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch("isRecurring") && form.getValues().isRecurring && (
              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem className="recurring-control">
                    <FormLabel>Frequency</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value ?? undefined}
                      disabled={isScanning}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue
                            placeholder="Select frequency"
                            className="!capitalize"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {frequencyOptions.map(({ value, label }) => (
                          <SelectItem
                            key={value}
                            value={value}
                            className="!capitalize"
                          >
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add notes about this transaction"
                      className="resize-none"
                      disabled={isScanning}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="sticky bottom-0 bg-white dark:bg-background p-2.5 border-t">
            <Button
              type="submit"
              className="w-full"
              disabled={isScanning || isCreating || isUpdating}
            >
              {isCreating || isUpdating ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : null}
              {isEdit ? "Update" : "Save"}
            </Button>
          </div>

          {isLoading && (
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/70 dark:bg-background/70 z-50 flex justify-center">
              <Loader className="h-8 w-8 animate-spin" />
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};

export default TransactionForm;
