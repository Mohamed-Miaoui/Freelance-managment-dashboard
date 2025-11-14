import * as yup from "yup";

const inputRules = /^[A-Za-z\s]+$/;
const phoneRules = /^[0-9]+$/;
const passwordRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const registerSchema = yup.object().shape({
    accountTypeRegister: yup
        .string()
        .oneOf(['individual', 'company'], 'Please select a valid account type')
        .required('Account type is required'),
    
    companyNameRegister: yup
        .string()
        .when('accountTypeRegister', {
            is: 'company',
            then: (schema) => schema
                .min(3, "Company name must be at least 3 characters long")
                .required("Company name is required"),
            otherwise: (schema) => schema.notRequired()
        }),
     BRC_Register: yup
        .string()
        .when('accountTypeRegister', {
            is: 'company',
            then: (schema) => schema
                .min(8, "BRC must be at least 8 characters long")
                .required("BRC is required"),
            otherwise: (schema) => schema.notRequired()
        }),

    usernameRegister: yup
        .string()
        .min(3, "First name must be at least 3 characters long")
        .matches(inputRules, "First name can only contain letters")
        .required("First name is required"),

    

    phoneNumberRegister: yup
        .string()
        .matches(phoneRules, "Phone number can only contain digits")
        .min(8, "Phone number must be at least 8 digits long")
        .max(15, "Phone number cannot exceed 15 digits")
        .required("Phone number is required"),

   


    emailRegister: yup
        .string()
        .email("Enter a valid email address")
        .required("Email is required"),

    passwordRegister: yup // i will return this condition later
        .string()
        .min(8, "Password must be at least 8 characters long")
        .matches(
            passwordRule,
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        )
        .required("Password is required"),
});

export const registerAdminSchema = yup.object().shape({
    name: yup
        .string()
        .min(3, "First name must be at least 3 characters long")
        .matches(inputRules, "First name can only contain letters")
        .required("First name is required"),

    phone: yup
        .string()
        .matches(phoneRules, "Phone number can only contain digits")
        .min(8, "Phone number must be at least 8 digits long")
        .max(15, "Phone number cannot exceed 15 digits"),
        

    email: yup
        .string()
        .email("Enter a valid email address")
        .required("Email is required"),

    password: yup 
        .string()
        .min(8, "Password must be at least 8 characters long")
        // .matches(
        //     passwordRule,
        //     "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        // )
        .required("Password is required"),
});

export const orderSchema = yup.object().shape({
    shipping_billing_Address: yup.object({
       recipientName: yup
      .string()
      .min(3, "First name must be at least 3 characters long")
      .matches(inputRules, "First name can only contain letters and spaces")
      .required("Recipient name is required"),
       phone: yup
      .string()
      .matches(phoneRules, "Phone number can only contain digits")
      .min(8, "Phone number must be at least 8 digits long")
      .max(15, "Phone number cannot exceed 15 digits")
      .required("Phone number is required"),
      addressLine1: yup
      .string()
      .min(3, "Address must be at least 3 characters long")
      .required("Address is required"),
      city: yup
      .string()
      .min(3, "City must be at least 3 characters long").required("City is required"),
      state: yup
      .string()
      .min(3, "State must be at least 3 characters long")
      .required("State is required"),
      postalCode: yup
      .string()
      .matches(/^\d{4}$/, "Postal code must be exactly 4 digits")
      .required("Postal code is required"),
      country: yup
      .string()
      .min(3, "Country must be at least 3 characters long").required("Country is required"),
    }),
    payment_method: yup.string().required("Payment method is required"),
  });

export const loginSchema = yup.object().shape({
    emailLogin: yup
        .string()
        .email("Enter a valid email address")
        .required("Email is required"),

    passwordLogin: yup
        .string()
        .min(5, "Password must be at least 5 characters long")
        .required("Password is required"),
});

export const changeEmailAndPassSchema = yup.object().shape({
    old_email: yup
        .string()
        .email("Enter a valid email address")
        .required("Email is required"),

    new_email: yup
        .string()
        .email("Enter a valid email address")
        .required("Email is required"),

    old_password: yup
        .string()
        .min(5, "Password must be at least 5 characters long")
        .required("Password is required"),
        
    new_password: yup
        .string()
        .min(5, "Password must be at least 5 characters long")
        .required("Password is required"),
});

  export const categorySchema = yup.object().shape({
    categoryName: yup
    .string()
    .min(3, "Category name must be at least 3 characters long")
    .required("Category name is required"),
  });
  export const userChangeSchema = yup.object().shape({
    name: yup
    .string()
    .min(3, " name must be at least 3 characters long")
    .required(" name is required"),
    email: yup
    .string()
    .email("Enter a valid email address")
    .required("Email is required"),
    phone: yup
    .string()
    .matches(phoneRules, "Phone number can only contain digits")
    .min(8, "Phone number must be at least 8 digits long")
    .max(15, "Phone number cannot exceed 15 digits")
    .required("Phone number is required"),
    // address: yup
    // .string()
    // .min(3, "Address must be at least 3 characters long")
    // .required("Address is required"),
  });
  export const brandSchema = yup.object().shape({
    brandName: yup
    .string()
    .min(3, "Brand name must be at least 3 characters long")
    .required("Brand name is required"),
  });
  export const certificationSchema = yup.object().shape({
    certificationName: yup
    .string()
    .min(3, "Certification name must be at least 3 characters long")
    .required("Certification name is required"),
  });


  export const productSchema = yup.object().shape({
    P_name: yup.string().required("Product title is required"),
    P_uniqueReferenceCode: yup.string().required("Unique reference code is required"),
    P_description: yup.string().required("Description is required"),
    P_stock_quantity: yup.number()
        .typeError("Quantity must be a number")
        .integer("Quantity must be a whole number")
        .positive("Quantity must be positive")
        .required("Stock quantity is required"),
    P_category: yup.string()
    .required("Category is required")
    .test('is-valid-object-id', 'Invalid category ID', (value) => {
        // MongoDB ObjectId validation pattern - 24 hex characters
        return !value || /^[0-9a-fA-F]{24}$/.test(value);
    }),
     // Make certification optional - it can be an empty string or a valid ObjectId
     P_certification: yup.string()
     .required("certification is required")
     .test('is-valid-object-id', 'Invalid certification ID', (value) => {
         // MongoDB ObjectId validation pattern - 24 hex characters
         return !value || /^[0-9a-fA-F]{24}$/.test(value);
     }),
    P_brand: yup.string()
    .required("Brand is required")
    .test('is-valid-object-id', 'Invalid category ID', (value) => {
        // MongoDB ObjectId validation pattern - 24 hex characters
        return !value || /^[0-9a-fA-F]{24}$/.test(value);
    }),
    P_itemsPerUnit: yup.number()
        .typeError("items per unit must be a number")
        .integer("items per unit must be a whole number")
        .positive("items per unit must be positive")
        .required("items per unit is required"),
    P_unitType: yup.string()
    .required("unit type is required"),

    P_isReusable: yup.boolean().required("Is reusable is required").default(false),

    variants: yup.array().of(
        yup.object().shape({
            value: yup.string().required("Variant value is required"),
            quantity: yup.number()
                .typeError("Quantity must be a number")
                .integer("Quantity must be a whole number")
                .min(0, "Quantity cannot be negative")
                .required("Quantity is required"),
            sku: yup.string().required("SKU is required")
        })
    ),

    
});

export const clientSchema = yup.object().shape({
    nom: yup
    .string()
    .min(3, "Characterstic title must be at least 3 characters long")
    .required("Characterstic titleis required"),
  
    email : yup
    .string()
    .email("Enter a valid email address")
    .required("Email is required"),

    telephone : yup
    .string()
    .matches(phoneRules, "Phone number can only contain digits")
    .min(8, "Phone number must be at least 8 digits long")
    .max(15, "Phone number cannot exceed 15 digits")
    .required("Phone number is required"),

    adresse : yup
    .string()
    .min(3, "Address must be at least 3 characters long")
    .required("Address is required"),

    matricule_fiscal : yup
    .string()
    .matches(/^\d{14}$/, "Matricule fiscal must be exactly 14 digits")
    .required("Matricule fiscal is required"),

    notes : yup
    .string()
    .min(3, "Notes must be at least 3 characters long")
    .required("Notes is required"),
  });

