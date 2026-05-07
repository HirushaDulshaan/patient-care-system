import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  CheckCircle2,
  Loader2,
  Calendar,
  User,
  ArrowRight,
} from "lucide-react";
const CREATE_APPOINTMENT = gql`
  mutation CreateAppointment(
    $patientData: PatientInput!
    $doctorId: String!
    $scheduledAt: String!
  ) {
    createAppointment(
      patientData: $patientData
      doctorId: $doctorId
      scheduledAt: $scheduledAt
    ) {
      id
      status
    }
  }
`;

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const hasSaved = useRef(false);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  const [confirmBooking] = useMutation(CREATE_APPOINTMENT);

  useEffect(() => {
    const finalizeBooking = async () => {
      const doctorId = searchParams.get("doctorId");
      const patientName = searchParams.get("patientName");
      const nic = searchParams.get("nic");
      const phone = searchParams.get("phone");
      const scheduledAt = searchParams.get("scheduledAt");

      if (doctorId && patientName && !hasSaved.current) {
        try {
          hasSaved.current = true; 
          console.log("Finalizing booking with data:", {
            doctorId,
            patientName,
            nic,
            phone,
            scheduledAt,
          });

          await confirmBooking({
            variables: {
              patientData: { fullName: patientName, nic, phone },
              doctorId,
              scheduledAt,
            },
          });

          setStatus("success");
        } catch (err) {
          console.error("Database save failed:", err);
          setStatus("error");
        }
      }
    };

    finalizeBooking();
  }, [searchParams, confirmBooking]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-[3.5rem] p-12 shadow-2xl shadow-blue-900/5 text-center border border-slate-100 animate-in fade-in zoom-in duration-500">
        {status === "loading" && (
          <div className="space-y-6">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto" />
            <h2 className="text-2xl font-black text-slate-900">
              Confirming Appointment...
            </h2>
            <p className="text-slate-400 text-sm font-medium">
              Please wait while we record your payment and update the registry.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-8">
            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-lg shadow-emerald-100 animate-bounce">
              <CheckCircle2 size={48} />
            </div>
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                Payment Successful!
              </h2>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">
                Appointment Secured
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-[2.5rem] text-left space-y-4 border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-600">
                  <User size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">
                    Patient
                  </p>
                  <p className="text-sm font-black text-slate-800">
                    {searchParams.get("patientName")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-600">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">
                    Scheduled Date
                  </p>
                  <p className="text-sm font-black text-slate-800">
                    {new Date(
                      searchParams.get("scheduledAt") || "",
                    ).toDateString()}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/")}
              className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-600 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
            >
              Go to Dashboard <ArrowRight size={16} />
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-6">
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-3xl flex items-center justify-center mx-auto">
              !
            </div>
            <h2 className="text-2xl font-black">Something went wrong</h2>
            <p className="text-slate-400 text-sm">
              Payment was received but we couldn't update the database. Please
              contact support.
            </p>
            <button
              onClick={() => navigate("/contact")}
              className="text-blue-600 font-bold uppercase text-xs"
            >
              Contact Support
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
