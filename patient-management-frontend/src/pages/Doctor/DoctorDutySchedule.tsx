import React from "react";
import {
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";

const GET_MY_SCHEDULES = gql`
  query GetMySchedules($doctorId: String!) {
    getDoctorSchedules(doctorId: $doctorId) {
      id
      workingDate
      startTime
      endTime
      status
      maxPatients
      bookedCount
      remainingSeats # 🔥 Model එකේ calculate වෙන එක මෙතනට ගන්නවා
    }
  }
`;

interface Props {
  doctorId: string;
}

const DoctorScheduleView: React.FC<Props> = ({ doctorId }) => {
  const { data, loading, error } = useQuery(GET_MY_SCHEDULES, {
    variables: { doctorId },
    pollInterval: 5000, 
  });

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">
          Loading Your Roster...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="p-10 text-red-500 bg-red-50 rounded-3xl font-bold">
        Error loading schedules: {error.message}
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header - Summary Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-2 text-blue-600">
            <Calendar size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              Personal Roster
            </span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            My Working Schedules
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            Admin assigned duties and real-time appointment tracking.
          </p>
        </div>

        <div className="bg-slate-50 px-6 py-4 rounded-2xl flex items-center gap-6">
          <div className="text-center">
            <p className="text-[8px] font-black text-slate-400 uppercase mb-1">
              Total Sessions
            </p>
            <p className="text-lg font-black text-slate-900">
              {data?.getDoctorSchedules.length || 0}
            </p>
          </div>
          <div className="w-[1px] h-8 bg-slate-200"></div>
          <div className="text-center">
            <p className="text-[8px] font-black text-slate-400 uppercase mb-1">
              Active Today
            </p>
            <p className="text-lg font-black text-emerald-600">
              {data?.getDoctorSchedules.filter(
                (s: any) =>
                  new Date(s.workingDate).toDateString() ===
                  new Date().toDateString(),
              ).length || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Schedule Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.getDoctorSchedules.map((schedule: any) => {
          const isFull = schedule.bookedCount >= schedule.maxPatients;
          const isPast =
            new Date(schedule.workingDate) <
            new Date(new Date().setHours(0, 0, 0, 0));

          return (
            <div
              key={schedule.id}
              className={`bg-white rounded-[3rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/20 relative overflow-hidden transition-all hover:-translate-y-1 ${isPast ? "opacity-60 grayscale" : ""}`}
            >
              <div className="flex justify-between items-start mb-6">
                <div
                  className={`p-4 rounded-2xl ${isFull ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500"}`}
                >
                  <Clock size={24} />
                </div>
                <div
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter ${schedule.status === "Available" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}
                >
                  {schedule.status === "Available" ? (
                    <CheckCircle2 size={10} />
                  ) : (
                    <XCircle size={10} />
                  )}
                  {schedule.status}
                </div>
              </div>

              <h3 className="text-xl font-black text-slate-900 mb-1">
                {new Date(schedule.workingDate).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "long",
                  day: "numeric",
                })}
              </h3>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-8">
                {schedule.startTime} - {schedule.endTime}
              </p>

              {/* Patient Progress Section */}
              <div className="space-y-4 pt-6 border-t border-slate-50">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Users size={12} /> Booked Patients
                  </span>
                  <span className="text-slate-900">
                    {schedule.bookedCount} / {schedule.maxPatients}
                  </span>
                </div>

                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${isFull ? "bg-red-500" : "bg-blue-600"}`}
                    style={{
                      width: `${(schedule.bookedCount / schedule.maxPatients) * 100}%`,
                    }}
                  ></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">
                    Available Slots
                  </span>
                  <span
                    className={`text-xs font-black ${schedule.remainingSeats <= 3 ? "text-red-500" : "text-emerald-600"}`}
                  >
                    {schedule.remainingSeats} Seats Left
                  </span>
                </div>
              </div>

              {isPast && (
                <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] flex items-center justify-center">
                  <span className="bg-slate-900 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em]">
                    Past Session
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {data?.getDoctorSchedules.length === 0 && (
        <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-slate-100">
          <p className="font-bold text-slate-300 uppercase text-xs tracking-widest">
            No duty sessions assigned by admin yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default DoctorScheduleView;
