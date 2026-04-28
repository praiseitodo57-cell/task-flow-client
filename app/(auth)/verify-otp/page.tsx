import { Suspense } from "react";
import VerifyOtpContent from "../../../components/VerifyOtpContent";
export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
          <VerifyOtpContent />
      </Suspense>
  );
}