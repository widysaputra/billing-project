const yup = useYup()

export function $patientSchema() {
   const create = yup.object({
      full_name: yup.string().required().label("Nama Pasien"),
      email: yup.string().email().nullable().label("Email"),
      phone_number: yup.string().max(13).nullable().label("No. Telepon"),
      identity_number: yup.string().length(16).required().label("NIK"),
      kta_number_cooperative: yup.string().nullable().label("Nomor KTA"),
      gender: yup.string().required().oneOf(["L", "P"]).label("Jenis Kelamin"),
      place_dob: yup.string().required().label("Tempat Lahir"),
      dob: yup.string().required().label("Tanggal Lahir"),
      address: yup.string().required().label("Alamat"),
      province_id: yup.number().integer().required().label("Provinsi"),
      regency_id: yup.number().integer().required().label("Kabupaten/Kota"),
      district_id: yup.number().integer().required().label("Kecamatan"),
      sub_district_id: yup.number().integer().required().label("Kelurahan"),
   })

   return { create }
}
