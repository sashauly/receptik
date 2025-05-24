/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

import { z } from "zod";

const Form = FormProvider;

// Create a context to store the schema
const FormSchemaContext = React.createContext<z.ZodObject<any> | null>(null);

// Custom hook to access the schema
function useSchema() {
  return React.useContext(FormSchemaContext);
}

// Schema provider component
function FormSchemaProvider({
  schema,
  children,
}: {
  schema: z.ZodObject<any>;
  children: React.ReactNode;
}) {
  return (
    <FormSchemaContext.Provider value={schema}>
      {children}
    </FormSchemaContext.Provider>
  );
}

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
);

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot="form-item"
        className={cn("grid gap-2", className)}
        {...props}
      />
    </FormItemContext.Provider>
  );
}

function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  const { error, formItemId } = useFormField();
  const fieldContext = React.useContext(FormFieldContext);
  const schema = useSchema();

  // Check if the field is required based on the schema
  const isRequired =
    schema && fieldContext?.name
      ? isFieldRequired(schema, fieldContext.name as string)
      : false;

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn("data-[error=true]:text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    >
      {props.children}
      {isRequired && <span className="text-destructive">*</span>}
    </Label>
  );
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { formDescriptionId } = useFormField();

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function FormMessage({ className, ...props }: React.ComponentProps<"p">) {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message ?? "") : props.children;

  if (!body) {
    return null;
  }

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn("text-destructive text-sm", className)}
      {...props}
    >
      {body}
    </p>
  );
}

// Helper function to check if a field is required in the Zod schema
function isFieldRequired(schema: z.ZodObject<any>, fieldName: string): boolean {
  try {
    // Get the shape of the schema
    const shape =
      typeof schema._def.shape === "function"
        ? schema._def.shape()
        : schema._def.shape;

    if (!shape) return false;

    // Check if the field exists in the schema
    if (!(fieldName in shape)) {
      return false;
    }

    // Get the field's schema
    const fieldSchema = shape[fieldName];
    if (!fieldSchema) return false;

    // Check if the field is optional
    return !isOptionalField(fieldSchema);
  } catch (error) {
    console.error(`Error checking if field ${fieldName} is required:`, error);
    return false;
  }
}

// Helper function to determine if a field is optional
function isOptionalField(fieldSchema: any): boolean {
  // If the field is wrapped with .optional()
  if (fieldSchema._def?.typeName === "ZodOptional") {
    return true;
  }

  // If the field is nullable but not optional
  if (fieldSchema._def?.typeName === "ZodNullable") {
    // Check the inner type
    return isOptionalField(fieldSchema._def.innerType);
  }

  // Other complex cases like union types that include undefined
  if (fieldSchema._def?.typeName === "ZodUnion") {
    return fieldSchema._def.options.some(
      (option: any) =>
        option._def.typeName === "ZodUndefined" ||
        option._def.typeName === "ZodNull"
    );
  }

  return false;
}

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormSchemaProvider,
  useFormField,
  useSchema,
};
