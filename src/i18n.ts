export type Language = 'el' | 'en'

export const translations = {
  el: {
    title: 'My Dream Box',
    tagline: 'Το προσωπικό σου Dream Box — γιατί όταν γράφεις τα όνειρά σου, κάνεις το πρώτο βήμα για να τα πραγματοποιήσεις.',
    loading: 'Φόρτωση...',
    loginIntro: 'Συνδέσου για να γράψεις και να αποθηκεύσεις τα όνειρά σου.',
    or: 'ή',
    logout: 'Έξοδος',
    emptyBox: 'Το Dream Box σου είναι ακόμη άδειο.',
    login: 'Σύνδεση',
    register: 'Εγγραφή',
    username: 'Username',
    password: 'Κωδικός',
    pleaseWait: 'Παρακαλώ περιμένετε...',
    createAccount: 'Δημιουργία λογαριασμού',
    dreamPlaceholder: 'Γράψε ένα όνειρο...',
    save: 'Αποθήκευση',
    markUnfulfilled: 'Σήμανση ονείρου ως μη πραγματοποιημένο',
    markFulfilled: 'Σήμανση ονείρου ως πραγματοποιημένο',
    deleteDream: 'Διαγραφή ονείρου',
    missingGoogleId: 'Λείπει το Google Client ID.',
    googleLoadError: 'Δεν φορτώθηκε το Google Login.',
    authError: 'Η σύνδεση απέτυχε.',
    saveError: 'Το όνειρο δεν αποθηκεύτηκε.',
    updateError: 'Η αλλαγή δεν αποθηκεύτηκε.',
    deleteError: 'Το όνειρο δεν διαγράφηκε.',
  },
  en: {
    title: 'My Dream Box',
    tagline: 'Your personal Dream Box — because writing down your dreams is the first step toward making them come true.',
    loading: 'Loading...',
    loginIntro: 'Sign in to write down and save your dreams.',
    or: 'or',
    logout: 'Log out',
    emptyBox: 'Your Dream Box is still empty.',
    login: 'Log in',
    register: 'Sign up',
    username: 'Username',
    password: 'Password',
    pleaseWait: 'Please wait...',
    createAccount: 'Create account',
    dreamPlaceholder: 'Write down a dream...',
    save: 'Save',
    markUnfulfilled: 'Mark dream as unfulfilled',
    markFulfilled: 'Mark dream as fulfilled',
    deleteDream: 'Delete dream',
    missingGoogleId: 'Google Client ID is missing.',
    googleLoadError: 'Google Login could not be loaded.',
    authError: 'Authentication failed.',
    saveError: 'The dream could not be saved.',
    updateError: 'The change could not be saved.',
    deleteError: 'The dream could not be deleted.',
  },
} as const

const apiErrorTranslations: Record<string, { el: string; en: string }> = {
  'Το username πρέπει να έχει 3-30 γράμματα, αριθμούς ή κάτω παύλα.': {
    el: 'Το username πρέπει να έχει 3-30 γράμματα, αριθμούς ή κάτω παύλα.',
    en: 'The username must contain 3-30 letters, numbers, or underscores.',
  },
  'Ο κωδικός πρέπει να έχει 8-128 χαρακτήρες.': {
    el: 'Ο κωδικός πρέπει να έχει 8-128 χαρακτήρες.',
    en: 'The password must contain 8-128 characters.',
  },
  'Αυτό το username χρησιμοποιείται ήδη.': {
    el: 'Αυτό το username χρησιμοποιείται ήδη.',
    en: 'This username is already in use.',
  },
  'Λάθος username ή κωδικός.': {
    el: 'Λάθος username ή κωδικός.',
    en: 'Incorrect username or password.',
  },
  'Authentication required': {
    el: 'Απαιτείται σύνδεση.',
    en: 'Authentication required.',
  },
  'Invalid or expired session': {
    el: 'Η σύνδεσή σου έληξε. Συνδέσου ξανά.',
    en: 'Your session has expired. Please sign in again.',
  },
}

export function localizeApiError(error: unknown, language: Language, fallback: string) {
  if (!(error instanceof Error)) return fallback
  return apiErrorTranslations[error.message]?.[language] || error.message || fallback
}
