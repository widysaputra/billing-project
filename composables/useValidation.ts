import {
   type ObjectSchema,
   type AnyObject,
   type Maybe,
   ValidationError,
   type InferType,
} from "yup"

type ValidationOpts<T> = {
   strict: boolean
   abortEarly: boolean
   stripUnknown: boolean
   recursive: boolean
   initialValues: T
}

type OnValidationSuccess<T> = (values: T) => unknown | Promise<unknown>
type OnValidationError<
   T extends Partial<Record<string, string>>,
   D extends InferType<ObjectSchema<Maybe<AnyObject>>>,
> = (errors: T, data: D) => unknown | Promise<unknown>

/**
 * @description
 * Composable function to validate given data using yup schema.
 * It will return an object with single method `validate` which will
 * validate the data and call the callbacks accordingly.
 *
 * @param {ObjectSchema<Maybe<AnyObject>>} schema - Yup schema to validate against
 * @param {InferType<T>} data - Data to validate
 * @param {Partial<ValidationOpts<InferType<T>>>} [opts] - Validation options
 *
 */
export default function <T extends ObjectSchema<Maybe<AnyObject>>>(
   schema: T,
   data: InferType<T>,
   opts?: Partial<ValidationOpts<InferType<T>>>
) {
   /**
    * Validates the given data against the schema
    *
    * @param {OnValidationSuccess<InferType<T>>} onSuccess - Callback to call when validation is successful
    * @param {OnValidationError<Partial<Record<(keyof InferType<T>), string>>, InferType<T>>} [onError] - Callback to call when validation fails
    * @returns {Promise<boolean>} - Promise that resolves to boolean indicating if the validation was successful or not
    */
   async function validate(
      onSuccess: OnValidationSuccess<typeof data>,
      onError?: OnValidationError<
         Partial<Record<keyof InferType<T>, string>>,
         InferType<T>
      >
   ): Promise<boolean> {
      let result = false
      let errors = {} as Partial<Record<keyof InferType<T>, string>>

      try {
         errors = {}
         await schema
            .validate(data, { abortEarly: false, ...opts })
            .then(async (res) => {
               await onSuccess(res)
               result = true
            })
      } catch (e) {
         const err = e as ValidationError
         if (err.inner) {
            err.inner.forEach((_e) => {
               errors[_e.path as keyof InferType<T>] = _e.message
            })
         } else {
            errors[err.path as keyof InferType<T>] = err.message
         }

         await onError?.(errors, data)
         result = false
      } finally {
         return result
      }
   }

   return {
      validate,
   }
}
