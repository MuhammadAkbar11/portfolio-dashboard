document.addEventListener("DOMContentLoaded", function () {
  const DatePickerDashboard = document.getElementById(
    "datetimepicker-dashboard"
  );

  const date = new Date();
  const defaultDate =
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

  if (DatePickerDashboard) {
    DatePickerDashboard.flatpickr({
      inline: true,
      prevArrow: '<span title="Previous month">&laquo;</span>',
      nextArrow: '<span title="Next month">&raquo;</span>',
      defaultDate: defaultDate,
    });
  }
});
