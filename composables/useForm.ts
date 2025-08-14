import { type AnyObject, type Maybe, type ObjectSchema } from "yup"
import { watchDebounced } from "@vueuse/core"

type UseFormOptions = {
   validateOnChange?: boolean
   onChangeDebounce?: number
}

export default function <
   V extends ObjectSchema<Maybe<AnyObject>>,
   T extends Record<keyof InferSchema<V>, any>,
>(initialValues: T, validationSchema: V, options?: UseFormOptions) {
   const form = ref<InferSchema<V> | Record<keyof T, undefined>>(initialValues)
   const error = ref<Partial<Record<keyof T, string>>>({})
   const validator = useValidation(validationSchema, form.value)
   const loading = shallowRef(false)

   async function submit<S, E>(
      onValidationSuccess: (values: InferSchema<V>) => S,
      onValidationError?: (
         errors: Partial<Record<keyof InferSchema<V>, string>>
      ) => E
   ) {
      error.value = {}
      loading.value = true
      await validator
         .validate(
            async (values) => await onValidationSuccess(values),
            async (e) => {
               error.value = e
               await onValidationError?.(e)
            }
         )
         .finally(() => {
            loading.value = false
         })
   }

   function reset(values?: Partial<T>) {
      form.value = { ...initialValues, ...values }
      error.value = {}
   }

   async function validateField(field: keyof T) {
      try {
         await validationSchema.validateAt(field as string, form.value)
         delete error.value[field]
      } catch (e) {
         const err = e as any
         error.value[field] = err.message
      }
   }

   if (options?.validateOnChange) {
      const lastForm = ref<typeof form.value>({ ...form.value })
      watchDebounced(
         form,
         (newForm) => {
            const changedKeys = Object.keys(newForm).filter(
               (key) => newForm[key] !== lastForm.value[key]
            )
            changedKeys.forEach((field) => {
               validateField(field as keyof T)
            })
            lastForm.value = { ...newForm }
         },
         { deep: true, debounce: options.onChangeDebounce ?? 200 }
      )
   }

   return {
      form,
      error,
      validator,
      loading,
      submit,
      reset,
      validateField,
   }
}
