// Type declarations for external libraries

// React
declare module 'react' {
  export type FC<P = {}> = React.FunctionComponent<P>;
  export interface FunctionComponent<P = {}> {
    (props: P, context?: any): React.ReactElement<any, any> | null;
    displayName?: string;
  }
  
  export type ReactElement = any;
  export type ReactNode = any;
  export type RefObject<T> = { current: T | null };
  
  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: readonly any[]): void;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: readonly any[]): T;
  export function useRef<T>(initialValue: T): RefObject<T>;
  
  export default any;
}

// Material UI
declare module '@mui/material' {
  export function styled(component: any, options?: any): any;
  
  export const Box: any;
  export const Typography: any;
  export const AppBar: any;
  export const Toolbar: any;
  export const Paper: any;
  export const Button: any;
  export const TextField: any;
  export const IconButton: any;
  export const Alert: any;
  export const AlertTitle: any;
  export const InputAdornment: any;
  export const CircularProgress: any;
  export const Divider: any;
  export const List: any;
  export const ListItem: any;
  export const ListItemButton: any;
  export const ListItemText: any;
  export const Stack: any;
  export const Switch: any;
  export const FormControl: any;
  export const FormControlLabel: any;
  export const FormLabel: any;
  export const Radio: any;
  export const RadioGroup: any;
  export const Container: any;
}

// Material UI Icons
declare module '@mui/icons-material/*' {
  const Icon: any;
  export default Icon;
}

declare module '@mui/icons-material/Send' {
  const SendIcon: any;
  export default SendIcon;
}

declare module '@mui/icons-material/Close' {
  const CloseIcon: any;
  export default CloseIcon;
}

declare module '@mui/icons-material/Add' {
  const AddIcon: any;
  export default AddIcon;
}

declare module '@mui/icons-material/Chat' {
  const ChatIcon: any;
  export default ChatIcon;
} 