const payAnAppointment = 
`
<p>Gracias por confiar en FranquiciaT, confirmamos tu cita con <strong>$1</strong>.</p>
<p>Profesionista: <strong>$1 - $2</strong><br>Día y hora: <strong>$3</strong><br>Motivo de la cita: <strong>$4</strong><br>Plataforma seleccionada: <strong>$5</strong></p>
<p><a href="${ process.env.FRONTEND_HOST }/profile/appointments-menu/purchased-appointments/CU">Ir a mis citas</a></p>
<p>Te deseamos un excelente día.</p>
<p>¡Tu equipo de FranquiciaT!</p>
`

const rescheduleAnAppointment = 
`
<p>Gracias por confiar en FranquiciaT, tu cita con <strong>$1</strong> ha sido reagendada.</p>
<p>Profesionista: <strong>$1 - $2</strong><br>Día y hora: <strong>$3</strong><br>Motivo de la cita: <strong>$4</strong><br>Plataforma seleccionada: <strong>$5</strong></p>
<p><a href="${ process.env.FRONTEND_HOST }/profile/appointments-menu/purchased-appointments/CU">Ir a mis citas</a></p>
<p>Te deseamos un excelente día.</p>
<p>¡Tu equipo de FranquiciaT!</p>
`

const stopAnAppointment = 
`
<p>Gracias por confiar en FranquiciaT, tu cita con <strong>$1</strong> ha sido suspendida.</p>
<p>Profesionista: <strong>$1 - $2</strong><br>Día y hora: <strong>$3</strong><br>Motivo de la cita: <strong>$4</strong><br>Plataforma seleccionada: <strong>$5</strong></p>
<p><a href="${ process.env.FRONTEND_HOST }/profile/appointments-menu/purchased-appointments/CU">Ir a mis citas</a></p>
<p>Te deseamos un excelente día.</p>
<p>¡Tu equipo de FranquiciaT!</p>
`

const cancelAppointment = 
`
<p>Gracias por confiar en FranquiciaT, tu cita con <strong>$1</strong> ha sido cancelada.</p>
<p>Profesionista: <strong>$1 - $2</strong><br>Día y hora: <strong>$3</strong><br>Motivo de la cita: <strong>$4</strong><br>Plataforma seleccionada: <strong>$5</strong></p>
<p><a href="${ process.env.FRONTEND_HOST }/profile/appointments-menu/purchased-appointments/CU">Ir a mis citas</a></p>
<p>Te deseamos un excelente día.</p>
<p>¡Tu equipo de FranquiciaT!</p>
`

const whatsappMsj = `Gracias por confiar en FranquiciaT`

module.exports = { 
    payAnAppointment,
    rescheduleAnAppointment,
    stopAnAppointment,
    cancelAppointment,
    whatsappMsj
} 