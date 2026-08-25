import { Spinner, type SpinnerProps } from "./spinner";

type PleaseWaitStateProps = SpinnerProps;

export const PleaseWaitState = ({
  className,
  size,
  variant,
}: PleaseWaitStateProps) => {
  return (
    <>
      <Spinner variant={variant} size={size} className={className} />
      Please Wait
    </>
  );
};
