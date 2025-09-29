vkBridge.send('VKWebAppInit')
  .then(async () => {
    console.log('VK Mini App initialized');
const form = document.getElementById('reg-form');
const launchParams = await vkBridge.send('VKWebAppGetLaunchParams');

document.addEventListener("DOMContentLoaded", () => {
  const id = launchParams.vk_user_id;
  const startParam = launchParams.start_data;
  window.vkUserId = id;
  window.vkUserStartParam = startParam;
});


document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('city');
  const otherInput = document.getElementById('city-other');

  select.addEventListener('change', () => {
    if (select.value === 'Другой') {
      otherInput.style.display = 'block';
    } else {
      otherInput.style.display = 'none';
      otherInput.value = ''; // Clear the input when hiding
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('citizen');
  const otherInput = document.getElementById('citizen-other');

  select.addEventListener('change', () => {
    if (select.value === 'Другое') {
      otherInput.style.display = 'block';
    } else {
      otherInput.style.display = 'none';
      otherInput.value = ''; // Clear the input when hiding
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('first_default');
  const otherInput = document.getElementById('first_video');

  select.addEventListener('change', () => {
    if (select.value === 'Video Editor') {
      otherInput.style.display = 'block';
    } else {
      otherInput.style.display = 'none';
      otherInput.value = ''; // Clear the input when hiding
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('second_default');
  const otherInput = document.getElementById('second_video');

  select.addEventListener('change', () => {
    if (select.value === 'Video Editor') {
      otherInput.style.display = 'block';
    } else {
      otherInput.style.display = 'none';
      otherInput.value = ''; // Clear the input when hiding
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
    const select = document.getElementById('foreign_phone_yes');
    const otherInput = document.getElementById('foreign_phone_type');
  
    select.addEventListener('change', () => {
      if (select.checked) {
        otherInput.style.display = 'block';
      } else {
        otherInput.style.display = 'none';
        otherInput.value = ''; // Clear the input when hiding
      }
    });
  });

document.addEventListener('DOMContentLoaded', () => {

const defaultBlocks = ['first_default', 'second_default']; 
const videoBlocks = ['first_video_choice', 'first_video', 'second_video_choice']

const allBlocks = [...defaultBlocks, ...videoBlocks];

window.isVideo = window.vkUserStartParam.includes('video');
  

  let visibleBlocks;
  if (window.isVideo) {
    visibleBlocks = videoBlocks;
  } else {
    document.getElementById('first_default').setAttribute('required', 'required');
    document.getElementById('second_default').setAttribute('required', 'required');
    visibleBlocks = defaultBlocks;
  }

  allBlocks.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.style.display = visibleBlocks.includes(id) ? 'block' : 'none';
    }
  });
});

const questionNames = ['surname', 'name', 'email', 'phone', 'city', 'city-other', 
  'citizen', 'citizen-other', 'vuz', 'specialty', 'study', 'finished', 
  'hours', 'first', 'second'];
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

// Function to show text blocks based on dropdown selection
function updateTextBlocks(dropdownId, mappings) {
  const dropdown = document.getElementById(dropdownId);
  const selectedValue = dropdown.value;
  
  // Hide all mapped text blocks
  mappings.forEach(([_, textBlockId]) => {
    const block = document.getElementById(textBlockId);
    if (block) block.style.display = 'none';
  });

  // Show the matching text block if it exists
  const textBlockId = mappings.find(([optionValue]) => optionValue === selectedValue)?.[1];
  if (textBlockId) {
    const block = document.getElementById(textBlockId);
    if (block) block.style.display = 'block';
  }
}

const questionMappings = [
  ['Projects', 'textBlock1'],
  ['Survey', 'textBlock2'],
  ['Corporate Marketing', 'textBlock3'],
  ['SMM', 'textBlock4'],
  ['Video Editor', 'textBlock5'],
  ['Sales', 'textBlock6'],
  ['University Partnership', 'textBlock7'],
  ['Account manager', 'textBlock8'],
  ['Creator', 'textBlock9'],
  ['Research', 'textBlock10']
];

const questionMappings2 = [
  ['Projects', 'textBlock1-2'],
  ['Survey', 'textBlock2-2'],
  ['Corporate Marketing', 'textBlock3-2'],
  ['SMM', 'textBlock4-2'],
  ['Video Editor', 'textBlock5-2'],
  ['Sales', 'textBlock6-2'],
  ['University Partnership', 'textBlock7-2'],
  ['Account manager', 'textBlock8-2'],
  ['Creator', 'textBlock9-2'],
  ['Research', 'textBlock10-2']
];

// text blocks event listeners
document.getElementById('first_default').addEventListener('change', () => {
  updateTextBlocks('first_default', questionMappings);
});

document.getElementById('second_default').addEventListener('change', () => {
  updateTextBlocks('second_default', questionMappings2);
});

function getSelectedCheckboxValues(name) {
  const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
  return Array.from(checkboxes).map(cb => cb.value);
}

form.addEventListener('submit', async function (e) {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];
  const formData = new FormData(form);
  const errorEl = document.getElementById('reg-error');
  const selectedFirstVideoValues = getSelectedCheckboxValues("first_video");
  const selectedSecondVideoValues = getSelectedCheckboxValues("second_video");
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
    second: formData.get('second')
  };
  e.preventDefault();

  const submitBtn = this.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'ОТПРАВЛЯЕТСЯ...'
  submitBtn.style.backgroundColor = '#ccc';
  submitBtn.style.color = '#666';
  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.textContent = 'ОТПРАВИТЬ'
    submitBtn.style.backgroundColor = '';
    submitBtn.style.color = '';
  }, 9000);
  
  let repeated = 'нет';
  try {
    const res = await fetch(`https://ndb.fut.ru/api/v2/tables/moqj9txmglwy87u/records/count?where=(E-mail,eq,${formData.get('email')})`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'xc-token': 'crDte8gB-CSZzNujzSsy9obQRqZYkY3SNp8wre88'
      }
    });

    const data_email = await res.json();
    
    if (data_email.count > 0) {
      repeated = 'да';
      errorEl.textContent = 'Ты уже зарегистрирован. Свяжись с нами через бота, если это не так или если ты хочешь изменить данные';
      return;
    }
  }
  catch (err) {
    console.error(err);
    errorEl.textContent = 'Ошибка сервера. Повтори попытку позже';
    }

  try {

    const phone_check = formData.get('phone');
    const foreign_phone = formData.get('foreign_phone_type');
    if (foreign_phone) {
      data.phone = foreign_phone; // Replace data.phone with foreign_phone value
    } else if (!/^[7]\d{10}$/.test(phone_check)) {
      errorEl.textContent = 'Phone must be 11 characters, format: 7XXXXXXXXXX';
      return;
    }
    // data.phone is set to foreign_phone if it exists, or validated phone_check if not
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.email)) {
    errorEl.textContent = 'Please enter a valid email (e.g., user@domain.com)';
    return;
    }
    const res = await fetch(`https://ndb.fut.ru/api/v2/tables/moqj9txmglwy87u/records/count?where=(Номер телефона,eq,${data.phone})`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'xc-token': 'crDte8gB-CSZzNujzSsy9obQRqZYkY3SNp8wre88'
      }
    });

    const data_phone = await res.json();
  
    if (data_phone.count > 0) {
      repeated = 'да';
      errorEl.textContent = 'Ты уже зарегистрирован. Свяжись с нами через бота, если это не так или если ты хочешь изменить данные';
      return;
    }
  }
  catch (err) {
    console.error(err);
    errorEl.textContent = 'Ошибка сервера. Повтори попытку позже';
    }

  try {
    const res = await fetch(`https://ndb.fut.ru/api/v2/tables/moqj9txmglwy87u/records/count?where=(tg-id,eq,${window.vkUserId})`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'xc-token': 'crDte8gB-CSZzNujzSsy9obQRqZYkY3SNp8wre88'
      }
    });

    const data_tgid = await res.json();
    
    if (data_tgid.count > 0) {
      repeated = 'да';
      errorEl.textContent = 'Ты уже зарегистрирован. Свяжись с нами через бота, если это не так или если ты хочешь изменить данные';
      return;
    }
  }
  catch (err) {
    console.error(err);
    errorEl.textContent = 'Ошибка сервера. Повтори попытку позже';
    }
  
  if (data.city === 'Другой') {data.city = data.city_other};
  if (data.citizen === 'Другое') {data.citizen = data.citizen_other};
  if (window.isVideo) {
    data.first = 'Video Editor';
    data.second = 'Video Editor';
  } else {
    data.first = data.first;
    data.second = data.second;
  };
  
  try {
    const aFirstChecked = document.getElementById('first_video-a').checked;
    const bFirstChecked = document.getElementById('first_video-b').checked;
    const aSecondChecked = document.getElementById('second_video-a').checked;
    const bSecondChecked = document.getElementById('second_video-b').checked;
    let approved_first = 'ок';
  // Multi-cascade conditions for rejection
    if (
      (data.hours === 'Менее 20 часов' || data.hours === '20 часов и более') ||
      (data.study === "Среднее общее (школа)") ||
      (data.first === 'Account manager' && (
        data.finished === "2029 и позднее" ||
        (data.study === "Магистратура" && (data.finished === "2022 и ранее" || data.finished === "2028")) ||
        (data.study === "Аспирантура" && (data.finished !== "2026" && data.finished !== "2027" && data.finished !== "2028")) ||
        (data.study === "Среднее специальное" && (data.finished !== "2024" && data.finished !== "2025" && data.finished !== "2026"))
      )) ||
      (data.first === 'Projects' && (
        data.finished === "2029 и позднее" ||
        (data.study === "Среднее специальное" && (data.finished !== '2026' || data.finished !== '2025' || data.finished !== '2027'))
      )) ||
      (data.first === 'Video Editor' && (
        data.finished === "2029 и позднее" ||
        (data.study === "Среднее специальное" && data.finished !== '2026')
      )) ||
      (data.first === 'Research' && (
        (data.finished !== "2025" && data.finished !== "2026" && data.finished !== "2027") ||
        (data.study === "Среднее специальное" && data.finished !== '2026')
      ))
    ) {
      approved_first = 'отказ';
    }

    let approved_second = 'ок';
  // Multi-cascade conditions for rejection
    if (
      (data.hours === 'Менее 20 часов' || data.hours === '20 часов и более') ||
      (data.study === "Среднее общее (школа)") ||
      (data.second === 'Account manager' && (
        data.finished === "2029 и позднее" ||
        (data.study === "Магистратура" && (data.finished === "2022 и ранее" || data.finished === "2028")) ||
        (data.study === "Аспирантура" && (data.finished !== "2026" && data.finished !== "2027" && data.finished !== "2028")) ||
        (data.study === "Среднее специальное" && (data.finished !== "2024" && data.finished !== "2025" && data.finished !== "2026")) ||
        (data.hours === "20 часов и более")
      )) ||
      (data.second === 'Projects' && (
        data.finished === "2029 и позднее" ||
        (data.study === "Среднее специальное" && (data.finished !== '2026' || data.finished !== '2025' || data.finished !== '2027'))
      )) ||
      (data.second === 'Video Editor' && (
        data.finished === "2029 и позднее" ||
        (data.study === "Среднее специальное" && data.finished !== '2026')
      ))  ||
      (data.second === 'Research' && (
        (data.finished !== "2025" && data.finished !== "2026" && data.finished !== "2027") ||
        (data.study === "Среднее специальное" && data.finished !== '2026')
      ))
    ) {
      approved_second = 'отказ';
    }

    if (selectedSecondVideoValues || selectedFirstVideoValues) {
      window.selectedVideoValues = [...new Set([...selectedFirstVideoValues, ...selectedSecondVideoValues])]
    }

    function validateFile(file) {
      if (file.size > 15 * 1024 * 1024) {
          return "Файл слишком большой (макс. 15MB)";
      }

      const validTypes = [
          "application/pdf", 
          "application/msword", 
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "image/png",
          "image/jpeg",
          "image/jpg",
          "image/gif",
          "image/webp"
      ];
      
      if (!validTypes.includes(file.type)) {
          return "Неподдерживаемый формат файла";
      }
      
      return null;
    }
    let attachmentData = null;
    try { 
      if (file) {
      const validationError = validateFile(file);
      if (validationError) {
          errorEl.textContent =  validationError;
          return;
      }
      const uploadFormData = new FormData(form);
      uploadFormData.append('file', file);
      uploadFormData.append('path', 'solutions');

        const uploadResponse = await fetch('https://ndb.fut.ru/api/v2/storage/upload', {
          method: 'POST',
          headers: {
            'xc-token': 'crDte8gB-CSZzNujzSsy9obQRqZYkY3SNp8wre88'
          },
          body: uploadFormData
        });

        let uploadData = await uploadResponse.json();
        if (!Array.isArray(uploadData)) {
            uploadData = [uploadData];
        }
        console.log(uploadData)
        if (!uploadData.length || !uploadData[0]?.signedUrl) {
            throw new Error("Не удалось получить информацию о файле");
        }
        
        const firstItem = uploadData[0];
        const fileName = firstItem.title || file.name;
        const fileType = firstItem.mimetype;
        const fileSize = firstItem.size;
        
        const getFileIcon = (mimeType) => {
            if (mimeType.includes("pdf")) return "mdi-file-pdf-outline";
            if (mimeType.includes("word")) return "mdi-file-word-outline";
            if (mimeType.includes("excel") || mimeType.includes("spreadsheet")) return "mdi-file-excel-outline";
            if (mimeType.includes("png")) return "mdi-file-image-outline";
            return "mdi-file-outline";
        };
        
        attachmentData = [
            {
              mimetype: fileType,
              size: fileSize,
              title: fileName,
              url: firstItem.url,
              icon: getFileIcon(fileType)
            }
        ];
    }      
    } catch (err) {
      errorEl.textContent = 'Не удалось загрузить файл: ' + err.message;
      return;
    }
    
    const res = await fetch('https://ndb.fut.ru/api/v2/tables/moqj9txmglwy87u/records', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
        'xc-token': 'crDte8gB-CSZzNujzSsy9obQRqZYkY3SNp8wre88'
      },
      body: JSON.stringify({
        "E-mail": data.email,
        "Фамилия": data.surname,
        "Имя": data.name,
        "Номер телефона": data.phone,
        "ВУЗ": data.vuz,
        "Направление подготовки": data.specialty,
        "Степень образования": data.study,
        "Год выпуска": data.finished,
        "График (часы)": data.hours,
        "Направление 1 приоритета": data.first,
        "Направление 2 приоритета": data.second,
        "Гражданство": data.citizen,
        "Город": data.city,
        "Скрининг итог (первый)": approved_first,
        "Скрининг итог (второй)": approved_second,
        "tg-id": window.vkUserId,
        "start-param": window.vkUserStartParam,
        "Инструменты Video Editor": window.selectedVideoValues.join(', '),
        "Резюме": attachmentData
      })
    }
    )
    window.location.href = 'bye.html'
  }
  catch (err) {
    console.error(err);
    errorEl.textContent = 'Ошибка сервера. Повтори попытку позже';
    }
});

form.addEventListener('input', saveForm);
restoreForm();
})
  .catch((error) => {
    console.error('VK init error:', error);

  });
