export function setupDropdownFilters() {
  // Открытие/закрытие главного фильтра (Filter, Trending now, Size, Price)
  document.querySelectorAll('.details__summary').forEach(summary => {
    summary.addEventListener('click', function (event) {
      event.preventDefault();
      const next = this.nextElementSibling;
      if (next && (next.classList.contains('summary__list') || next.classList.contains('filters__dropdown_list'))) {
        next.classList.toggle('active');
        this.classList.toggle('active');
      }
    });
  });

  // Открытие/закрытие вложенных фильтров (категория, бренд)
  document.querySelectorAll('.summary__item_link').forEach(link => {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      const dropdown = this.nextElementSibling;
      if (dropdown && dropdown.classList.contains('summary__dropdown_list')) {
        dropdown.classList.toggle('active');
        this.classList.toggle('active');
      }
    });
  });

  // Закрытие всех выпадающих при клике вне фильтров
  document.addEventListener('click', function (event) {
    // Главный фильтр
    document.querySelectorAll('.summary__list.active').forEach(list => {
      const summary = list.previousElementSibling;
      if (!list.contains(event.target) && !summary.contains(event.target)) {
        list.classList.remove('active');
        summary.classList.remove('active');
      }
    });
    // Вложенные фильтры
    document.querySelectorAll('.summary__dropdown_list.active').forEach(list => {
      const link = list.previousElementSibling;
      if (!list.contains(event.target) && !link.contains(event.target)) {
        list.classList.remove('active');
        link.classList.remove('active');
      }
    });
    // Trending now, Size, Price
    document.querySelectorAll('.filters__dropdown_list.active').forEach(list => {
      const summary = list.previousElementSibling;
      if (!list.contains(event.target) && !summary.contains(event.target)) {
        list.classList.remove('active');
        summary.classList.remove('active');
      }
    });
  });
}
