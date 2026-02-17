import { useState } from "react";
import { MuiOtpInput } from "mui-one-time-password-input";

export default function OTPBox() {
  const [otp, setOtp] = useState("");

  return <MuiOtpInput value={otp} onChange={setOtp} length={6} />;
}
