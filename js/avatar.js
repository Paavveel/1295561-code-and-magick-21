'use stcrict';

const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

const fileChooser = document.querySelector('.upload input[type=file]');
const preview = document.querySelector('.setup-user-pic');

fileChooser.addEventListener('change', () => {
  const [file] = fileChooser.files;
  const fileName = file.name.toLowerCase();

  const matches = FILE_TYPES.some((type) => fileName.endsWith(type));

  if (matches) {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.addEventListener('load', () => {
      preview.src = reader.result;
    });
  }
});
