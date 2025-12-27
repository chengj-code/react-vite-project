interface MyButtonProps {
    title: string;
    disabled?: boolean;
}

const MyButton = ({ title, disabled }: MyButtonProps) => {
    return <button disabled={disabled}>{title}</button>;
};

export default MyButton;
