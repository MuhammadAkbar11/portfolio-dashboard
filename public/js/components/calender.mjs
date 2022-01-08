document.addEventListener("DOMContentLoaded", function () {
  const datePickerDashboard = document.getElementById(
    "datetimepicker-dashboard"
  );

  const date = new Date();
  const defaultDate =
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

  if (datePickerDashboard) {
    datePickerDashboard.flatpickr({
      inline: true,
      prevArrow: '<span title="Previous month">&laquo;</span>',
      nextArrow: '<span title="Next month">&raquo;</span>',
      defaultDate: defaultDate,
    });
  }
});
