const questionMappings = [
  ['Projects', 'textBlock1'],
  ['Survey', 'textBlock2'],
  ['Designer', 'textBlock3'],
  ['Innovation', 'textBlock4'],
  ['SMM', 'textBlock5'],
  ['SMM в IT', 'textBlock6'],
  ['Community marketing', 'textBlock7'],
  ['Digital marketing', 'textBlock8'],
  ['Accounts', 'textBlock9']
];

const questionMappings2 = [
  ['Projects', 'textBlock1-2'],
  ['Survey', 'textBlock2-2'],
  ['Designer', 'textBlock3-2'],
  ['Innovation', 'textBlock4-2'],
  ['SMM', 'textBlock5-2'],
  ['SMM в IT', 'textBlock6-2'],
  ['Community marketing', 'textBlock7-2'],
  ['Digital marketing', 'textBlock8-2'],
  ['Accounts', 'textBlock9-2']
];

function updateTextBlocks(dropdownId, mappings) {
  const dropdown = document.getElementById(dropdownId);
  if (!dropdown) return;

  const selectedValue = dropdown.value;

  mappings.forEach(([_, textBlockId]) => {
    const block = document.getElementById(textBlockId);
    if (block) block.style.display = 'none';
  });

  const match = mappings.find(([optionValue]) => optionValue === selectedValue);
  if (match) {
    const block = document.getElementById(match[1]);
    if (block) block.style.display = 'block';
  }
}

function configureFirstByStartParam() {
  const select = document.getElementById('first_default');
  if (!select) return;

  const startParam = '-';

  const mapping = [
    { keyword: 'projects', value: ['Projects', 'Survey'] },
    { keyword: 'survey', value: ['Survey'] },
    { keyword: 'innovation',  value: ['Innovation', 'SMM в IT']},
    { keyword: 'gen_smm',  value: ['SMM', 'SMM в IT']},
    { keyword: 'it_smm',  value: ['SMM в IT']},
    { keyword: 'com_marketing',  value: ['Community marketing']},
    { keyword: 'dig_marketing',  value: ['Digital marketing']},
    { keyword: 'accounts',  value: ['Accounts']}
  ];

  const matched = mapping.find(m => startParam.includes(m.keyword));
  if (!matched) {
    select.style.display = 'block';
    return;
  }

  const allowedValues = matched.value;

  Array.from(select.options).forEach(opt => {
    if (opt.value === '' || allowedValues.includes(opt.value)) {
      opt.hidden = false;
    } else {
      opt.hidden = true;
    }
  });

  select.value = allowedValues[0];
  select.style.display = 'block';

  updateTextBlocks('first_default', questionMappings);
}

document.addEventListener('DOMContentLoaded', () => {
  initializeForm();
});

async function initializeForm() {
  const form = document.getElementById('reg-form');
  if (!form) {
    console.error('Form with ID "reg-form" not found');
    return;
  }

  try {
    await vkBridge.send('VKWebAppInit');
    console.log('VK Mini App initialized');

    const u = await vkBridge.send('VKWebAppGetUserInfo');
    window.vkUserId = `${u.id}_VK`;

    configureFirstByStartParam();
  } catch (err) {
    console.error('VK init error:', err);
    const errorEl = document.getElementById('reg-error');
    if (errorEl) {
      errorEl.textContent = 'Ошибка инициализации VK: ' + err.message;
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const selectCity = document.getElementById('city');
    const otherCityInput = document.getElementById('city-other');
    if (selectCity && otherCityInput) {
      selectCity.addEventListener('change', () => {
        otherCityInput.style.display = selectCity.value === 'Другой' ? 'block' : 'none';
        otherCityInput.value = selectCity.value === 'Другой' ? otherCityInput.value : '';
      });
    }

    const selectCitizen = document.getElementById('citizen');
    const otherCitizenInput = document.getElementById('citizen-other');
    if (selectCitizen && otherCitizenInput) {
      selectCitizen.addEventListener('change', () => {
        otherCitizenInput.style.display = selectCitizen.value === 'Другое' ? 'block' : 'none';
        otherCitizenInput.value = selectCitizen.value === 'Другое' ? otherCitizenInput.value : '';
      });
    }

    const foreignPhoneYes = document.getElementById('foreign_phone_yes');
    const foreignPhoneType = document.getElementById('foreign_phone_type');
    if (foreignPhoneYes && foreignPhoneType) {
      foreignPhoneYes.addEventListener('change', () => {
        foreignPhoneType.style.display = foreignPhoneYes.checked ? 'block' : 'none';
        foreignPhoneType.value = foreignPhoneYes.checked ? foreignPhoneType.value : '';
      });
    }

    const toggle = document.getElementById("policy_toggle");
    const block = document.getElementById("policy_text_block");
    toggle.addEventListener("click", () => {
    block.style.display = block.style.display === "none" ? "block" : "none";
  });
  });


  const questionNames = [
    'surname', 'name', 'email', 'phone', 'city', 'city-other',
    'citizen', 'citizen-other', 'vuz', 'specialty', 'study', 'finished',
    'hours', 'first', 'second'
  ];

  function saveForm() {
    const formData = new FormData(form);
    const data = {};
    questionNames.forEach(qName => {
      data[qName] = formData.get(qName) || '';
    });
    localStorage.setItem('test_data', JSON.stringify(data));
  }

  function restoreForm() {
    const saved = JSON.parse(localStorage.getItem('test_data') || '{}');
    questionNames.forEach(qName => {
      const input = form.elements[qName];
      if (input) input.value = saved[qName] || '';
    });
  }

document.getElementById('first_default').addEventListener('change', () => {
  updateTextBlocks('first_default', questionMappings);
});

document.getElementById('second_default').addEventListener('change', () => {
  updateTextBlocks('second_default', questionMappings2);
});

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const formData = new FormData(form);
    const errorEl = document.getElementById('reg-error');
    const data = {
      surname: formData.get('surname'),
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      city: formData.get('city'),
      city_other: formData.get('city-other'),
      citizen: formData.get('citizen'),
      citizen_other: formData.get('citizen-other'),
      vuz: formData.get('vuz'),
      specialty: formData.get('specialty'),
      study: formData.get('study'),
      finished: formData.get('finished'),
      hours: formData.get('hours'),
      first: formData.get('first'),
      second: formData.get('second'),
      previous: formData.get('previous')
    };

    const submitBtn = this.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'ОТПРАВЛЯЕТСЯ...';
    submitBtn.style.backgroundColor = '#ccc';
    submitBtn.style.color = '#666';
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = 'ОТПРАВИТЬ';
      submitBtn.style.backgroundColor = '';
      submitBtn.style.color = '';
    }, 9000);

    // Check for duplicate email
    try {
      const res = await fetch(`https://ndb.fut.ru/api/v2/tables/m6tyxd3346dlhco/records/count?where=(E-mail,eq,${encodeURIComponent(data.email)})`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'xc-token': 'crDte8gB-CSZzNujzSsy9obQRqZYkY3SNp8wre88'
        }
      });

      const data_email = await res.json();
      if (data_email.count > 0) {
        errorEl.textContent = 'Ты уже зарегистрирован. Свяжись с нами через бота, если это не так или если ты хочешь изменить данные';
        return;
      }
    } catch (err) {
      console.error('Email check error:', err);
      errorEl.textContent = 'Ошибка сервера. Повтори попытку позже';
      return;
    }

    // Validate phone
    try {
      const phone_check = formData.get('phone');
      const foreign_phone = formData.get('foreign_phone_type');
      if (foreign_phone) {
        data.phone = foreign_phone;
      } else if (!/^[7]\d{10}$/.test(phone_check)) {
        errorEl.textContent = 'Телефон должен состоять из 11 цифр, формат: 7XXXXXXXXXX';
        return;
      }

      const res = await fetch(`https://ndb.fut.ru/api/v2/tables/m6tyxd3346dlhco/records/count?where=(Номер телефона,eq,${encodeURIComponent(data.phone)})`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'xc-token': 'crDte8gB-CSZzNujzSsy9obQRqZYkY3SNp8wre88'
        }
      });

      const data_phone = await res.json();
      if (data_phone.count > 0) {
        errorEl.textContent = 'Ты уже зарегистрирован. Свяжись с нами через бота, если это не так или если ты хочешь изменить данные';
        return;
      }
    } catch (err) {
      console.error('Phone check error:', err);
      errorEl.textContent = 'Ошибка сервера. Повтори попытку позже';
      return;
    }

    // Check for duplicate vk_user_id
    try {
      const res = await fetch(`https://ndb.fut.ru/api/v2/tables/m6tyxd3346dlhco/records/count?where=(tg-id,eq,${window.vkUserId})`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'xc-token': 'crDte8gB-CSZzNujzSsy9obQRqZYkY3SNp8wre88'
        }
      });

      const data_tgid = await res.json();
      if (data_tgid.count > 0) {
        errorEl.textContent = 'Ты уже зарегистрирован. Свяжись с нами через бота, если это не так или если ты хочешь изменить данные';
        return;
      }
    } catch (err) {
      console.error('User ID check error:', err);
      errorEl.textContent = 'Ошибка сервера. Повтори попытку позже';
      return;
    }

    // Process form data
    if (data.city === 'Другой') data.city = data.city_other;
    if (data.citizen === 'Другое') data.citizen = data.citizen_other;

    let approved_first = 'ок';
  if (
    data.hours === 'Менее 20 часов' ||
    data.study === "Среднее общее (школа)" ||
    // --- Projects ---
    (data.first === 'Projects' && (
      (
        (data.study === "Бакалавриат" || data.study === "Специалитет" || data.study === "Магистратура" || data.study === "Аспирантура") &&
        (data.finished === "2029 и позднее" || data.finished === "2021 и ранее")
      ) ||
      (
        data.study === "Среднее специальное" &&
        (data.finished !== "2024" && data.finished !== "2025" && data.finished !== "2026" && data.finished !== "2027")
      ) ||
      data.hours === "20 часов"
    )) ||
    // --- Survey ---
    (data.first === 'Survey' && (
      (
        (data.study === "Бакалавриат" || data.study === "Специалитет" || data.study === "Магистратура" || data.study === "Аспирантура") &&
        (data.finished !== "2025" && data.finished !== "2026" && data.finished !== "2027")
      ) ||
      (
        data.study === "Среднее специальное" &&
        data.finished !== "2026"
      ) ||
      data.hours === "20 часов"
    )) ||
    // --- Designer ---
    (data.first === 'Designer' && (
      (
        (data.study === "Бакалавриат" || data.study === "Специалитет" || data.study === "Магистратура" || data.study === "Аспирантура") &&
        (data.finished !== "2024" && data.finished !== "2025" && data.finished !== "2026" && data.finished !== "2027" && data.finished !== "2028")
      ) ||
      (
        data.study === "Среднее специальное" &&
        (data.finished !== "2025" && data.finished !== "2026" && data.finished !== "2027")
      )
    )) ||
    // --- Innovation ---
    (data.first === 'Innovation' && (
      (
        (data.study === "Бакалавриат" || data.study === "Специалитет" || data.study === "Магистратура" || data.study === "Аспирантура") &&
        (data.finished !== "2024" && data.finished !== "2025" && data.finished !== "2026" && data.finished !== "2027")
      ) ||
      data.study === "Среднее специальное" ||
      data.hours === "20 часов и более"
    )) ||
    // --- SMM ---
    (data.first === 'SMM' && (
      data.study === "Аспирантура" ||
      (
        (data.study === "Бакалавриат" || data.study === "Специалитет" || data.study === "Магистратура") &&
        (data.finished !== "2024" && data.finished !== "2025" && data.finished !== "2026" && data.finished !== "2027" && data.finished !== "2028")
      ) ||
      (
        data.study === "Среднее специальное" &&
        data.finished !== "2026"
      )
    )) ||
    // --- SMM в IT ---
    (data.first === 'SMM в IT' && (
      (
        (data.study === "Бакалавриат" || data.study === "Специалитет" || data.study === "Магистратура") &&
        (data.finished !== "2024" && data.finished !== "2025" && data.finished !== "2026" && data.finished !== "2027" && data.finished !== "2028")
      ) ||
      data.study === "Аспирантура" ||
      data.study === "Среднее специальное" ||
      data.hours === "20 часов и более"
    )) ||
    // --- Community marketing ---
    (data.first === 'Community marketing' && (
      (
        (data.study === "Бакалавриат" || data.study === "Специалитет" || data.study === "Магистратура" || data.study === "Аспирантура") &&
        (data.finished === "2029 и позднее" || data.finished === "2021 и ранее")
      ) ||
      (
        data.study === "Среднее специальное" &&
        (data.finished !== "2024" && data.finished !== "2025" && data.finished !== "2026" && data.finished !== "2027")
      )
    )) ||
    // --- Digital marketing ---
    (data.first === 'Digital marketing' && (
      (
        (data.study === "Бакалавриат" || data.study === "Специалитет" || data.study === "Магистратура" || data.study === "Аспирантура") &&
        (data.finished !== "2024" && data.finished !== "2025" && data.finished !== "2026" && data.finished !== "2027")
      ) ||
      (
        data.study === "Среднее специальное" &&
        (data.finished !== "2025" && data.finished !== "2026")
      ) ||
      data.hours === "20 часов и более"
    )) ||
    // --- Accounts ---
    (data.first === 'Accounts' && (
      (
        (data.study === "Бакалавриат" || data.study === "Специалитет") &&
        data.finished === "2029 и позднее"
      ) ||
      (
        data.study === "Магистратура" &&
        (data.finished !== "2023" && data.finished !== "2024" && data.finished !== "2025" && data.finished !== "2026" && data.finished !== "2027")
      ) ||
      (
        data.study === "Аспирантура" &&
        (data.finished !== "2026" && data.finished !== "2027" && data.finished !== "2028")
      ) ||
      (
        data.study === "Среднее специальное" &&
        (data.finished !== "2024" && data.finished !== "2025" && data.finished !== "2026")
      ) ||
      data.hours === "20 часов и более"
    ))
  ) {
    approved_first = 'отказ';
  }

    let approved_second = 'ок';
  if (
    data.hours === 'Менее 20 часов' ||
    data.study === "Среднее общее (школа)" ||
    // --- Projects ---
    (data.second === 'Projects' && (
      (
        (data.study === "Бакалавриат" || data.study === "Специалитет" || data.study === "Магистратура" || data.study === "Аспирантура") &&
        (data.finished === "2029 и позднее" || data.finished === "2021 и ранее")
      ) ||
      (
        data.study === "Среднее специальное" &&
        (data.finished !== "2024" && data.finished !== "2025" && data.finished !== "2026" && data.finished !== "2027")
      ) ||
      data.hours === "20 часов"
    )) ||
    // --- Survey ---
    (data.second === 'Survey' && (
      (
        (data.study === "Бакалавриат" || data.study === "Специалитет" || data.study === "Магистратура" || data.study === "Аспирантура") &&
        (data.finished !== "2025" && data.finished !== "2026" && data.finished !== "2027")
      ) ||
      (
        data.study === "Среднее специальное" &&
        data.finished !== "2026"
      ) ||
      data.hours === "20 часов"
    )) ||
    // --- Designer ---
    (data.second === 'Designer' && (
      (
        (data.study === "Бакалавриат" || data.study === "Специалитет" || data.study === "Магистратура" || data.study === "Аспирантура") &&
        (data.finished !== "2024" && data.finished !== "2025" && data.finished !== "2026" && data.finished !== "2027" && data.finished !== "2028")
      ) ||
      (
        data.study === "Среднее специальное" &&
        (data.finished !== "2025" && data.finished !== "2026" && data.finished !== "2027")
      )
    )) ||
    // --- Innovation ---
    (data.second === 'Innovation' && (
      (
        (data.study === "Бакалавриат" || data.study === "Специалитет" || data.study === "Магистратура" || data.study === "Аспирантура") &&
        (data.finished !== "2024" && data.finished !== "2025" && data.finished !== "2026" && data.finished !== "2027")
      ) ||
      data.study === "Среднее специальное" ||
      data.hours === "20 часов и более"
    )) ||
    // --- SMM ---
    (data.second === 'SMM' && (
      data.study === "Аспирантура" ||
      (
        (data.study === "Бакалавриат" || data.study === "Специалитет" || data.study === "Магистратура") &&
        (data.finished !== "2024" && data.finished !== "2025" && data.finished !== "2026" && data.finished !== "2027" && data.finished !== "2028")
      ) ||
      (
        data.study === "Среднее специальное" &&
        data.finished !== "2026"
      )
    )) ||
    // --- SMM в IT ---
    (data.second === 'SMM в IT' && (
      (
        (data.study === "Бакалавриат" || data.study === "Специалитет" || data.study === "Магистратура") &&
        (data.finished !== "2024" && data.finished !== "2025" && data.finished !== "2026" && data.finished !== "2027" && data.finished !== "2028")
      ) ||
      data.study === "Аспирантура" ||
      data.study === "Среднее специальное" ||
      data.hours === "20 часов и более"
    )) ||
    // --- Community marketing ---
    (data.second === 'Community marketing' && (
      (
        (data.study === "Бакалавриат" || data.study === "Специалитет" || data.study === "Магистратура" || data.study === "Аспирантура") &&
        (data.finished === "2029 и позднее" || data.finished === "2021 и ранее")
      ) ||
      (
        data.study === "Среднее специальное" &&
        (data.finished !== "2024" && data.finished !== "2025" && data.finished !== "2026" && data.finished !== "2027")
      )
    )) ||
    // --- Digital marketing ---
    (data.second === 'Digital marketing' && (
      (
        (data.study === "Бакалавриат" || data.study === "Специалитет" || data.study === "Магистратура" || data.study === "Аспирантура") &&
        (data.finished !== "2024" && data.finished !== "2025" && data.finished !== "2026" && data.finished !== "2027")
      ) ||
      (
        data.study === "Среднее специальное" &&
        (data.finished !== "2025" && data.finished !== "2026")
      ) ||
      data.hours === "20 часов и более"
    )) ||
    // --- Accounts ---
    (data.second === 'Accounts' && (
      (
        (data.study === "Бакалавриат" || data.study === "Специалитет") &&
        data.finished === "2029 и позднее"
      ) ||
      (
        data.study === "Магистратура" &&
        (data.finished !== "2023" && data.finished !== "2024" && data.finished !== "2025" && data.finished !== "2026" && data.finished !== "2027")
      ) ||
      (
        data.study === "Аспирантура" &&
        (data.finished !== "2026" && data.finished !== "2027" && data.finished !== "2028")
      ) ||
      (
        data.study === "Среднее специальное" &&
        (data.finished !== "2024" && data.finished !== "2025" && data.finished !== "2026")
      ) ||
      data.hours === "20 часов и более"
    ))
  ) {
    approved_second = 'отказ';
  }

    // Submit form data
    try {
      const res = await fetch('https://ndb.fut.ru/api/v2/tables/m6tyxd3346dlhco/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
          'xc-token': 'crDte8gB-CSZzNujzSsy9obQRqZYkY3SNp8wre88'
        },
        body: JSON.stringify({
          'E-mail': data.email,
          'Фамилия': data.surname,
          'Имя': data.name,
          'Номер телефона': data.phone,
          'ВУЗ': data.vuz,
          'Направление подготовки': data.specialty,
          'Степень образования': data.study,
          'Год выпуска': data.finished,
          'График (часы)': data.hours,
          'Направление 1 приоритета': data.first,
          'Направление 2 приоритета': data.second,
          'Гражданство': data.citizen,
          'Город': data.city,
          'Скрининг итог (первый)': approved_first,
          'Скрининг итог (второй)': approved_second,
          'tg-id': window.vkUserId,
          'start-param': 'VK',
          'Прошлый отбор': data.previous
        })
      });

      if (res.ok) {
        window.location.href = 'bye.html';
      } else {
        errorEl.textContent = 'Ошибка при сохранении данных';
      }
    } catch (err) {
      console.error('Submit error:', err);
      errorEl.textContent = 'Ошибка сервера. Повтори попытку позже';
    }
  });

  form.addEventListener('input', saveForm);
  restoreForm();
}












