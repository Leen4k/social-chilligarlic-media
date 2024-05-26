export interface ButtonProps{
    text: string;
    type: "button" | "submit" | "reset" | undefined;
    bgColor: string;
    disabled: boolean;
    action: (...args: any) => any;
}