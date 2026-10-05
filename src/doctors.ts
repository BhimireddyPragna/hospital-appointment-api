//import prisma from "./lib/prisma";

import prisma from "./lib/prisma.js";


export async function createDoctor(data: {
name: string;
specialty: string;
email: string;
}) {
return prisma.doctor.create({ data });
}

export async function getDoctor(id: number) {
const doctor = await prisma.doctor.findUnique({ where: { id } });
if (doctor === null) throw new Error("Doctor not found");
return doctor;
}

export async function listDoctorsBySpecialty(specialty: string) {
return prisma.doctor.findMany({
  where: { specialty: { contains: specialty } },
  orderBy: { name: "asc" },
  select: { id: true, name: true, specialty: true, email: true },
});
}

export async function deleteDoctor(id: number) {
// Note: ON DELETE RESTRICT on appointments.doctor_id
// Deleting a doctor who has appointments will throw a FK constraint error.
// Delete or reassign their appointments first.
return prisma.doctor.delete({ where: { id } });
}
export async function getDoctorUpcomingAppointments(doctorId: number) {
return prisma.appointment.findMany({
  where: {
    doctorId,
    status: "scheduled",
    appointmentDate: { gte: new Date() },
  },
  orderBy: { appointmentDate: "asc" },
  include: {
    patient: { select: { name: true, phone: true } },
  },
});
}