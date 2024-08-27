import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          "addCoach": "Add Coach",
          "coachEmail": "Coach's Email",
          "errorAddingCoach": "An error occurred while adding the coach",
          "coachAddedSuccessfully": "Coach added successfully",
          "connectionError": "Error connecting to the server. Check your connection and try again.",
          "add": "Add",
          "back": "Back",
          "addTraining": "Add Training",
          "trainingName": "Training Name",
          "description": "Description",
          "date": "Date",
          "startTime": "Start Time",
          "endTime": "End Time",
          "totalPlaces": "Total Places",
          "gym": "Gym",
          "zone": "Zone",
          "selectGym": "Select a Gym",
          "selectZone": "Select a Zone",
          "startDateInPast": "The start date and time cannot be in the past.",
          "endTimeBeforeStart": "The end time must be after the start time.",
          "errorCreatingTraining": "Error creating training",
          "trainingAddedSuccessfully": "Training added successfully",
          "failedToAddTraining": "Failed to add training",
          "errorOccurred": "Error occurred",
          "homepage": "Homepage",
          "clientReservationsTitle": "Your Booked Trainings",
          "loading": "Loading...",
          "noReservations": "You are not booked for any trainings.",
          "errorLoadingReservations": "Error loading reservation data.",
          "cancelReservation": "Cancel Reservation",
          "reservationCancelled": "Reservation cancelled.",
          "errorCancellingReservation": "Error cancelling the reservation.",
          "remainingPlaces": "Remaining Places",
          "coachGymsTitle": "List of all gyms where you work",
          "noGymsMessage": "You are not working in any gyms.",
          "errorLoadingGyms": "Error loading gym data.",
          "viewGymTrainings": "View gym trainings",
          "viewGymZones": "View zones",
          "resign": "Resign",
          "resignConfirmation": "Are you sure you want to resign from this gym? This action cannot be undone.",
          "resignError": "Error resigning from the gym.",
          "noGymsLeftMessage": "You are no longer working in any gyms.",
          "coachTrainingsTitle": "Your Trainings",
          "errorLoadingUserData": "Error loading user data",
          "fetchDataError": "Failed to fetch data",
          "deleteTraining": "Delete Training",
          "deleteTrainingConfirmation": "Are you sure you want to delete this training? This action cannot be undone.",
          "deleteTrainingError": "Error deleting the training",
          "addTrainingButton": "Add Training",
          "editTrainingButton": "Edit Training",
          "welcomeToGymManager": "Welcome to the Gym Manager",
          "role": "Role",
          "owner": "Owner",
          "coach": "Coach",
          "client": "Client",
          "username": "Username",
          "email": "Email",
          "viewYourGyms": "View your gyms",
          "viewYourGymsAsCoach": "View all gyms where you work",
          "viewYourTrainingsAsCoach": "View all your trainings",
          "viewAllGyms": "View all gyms",
          "viewYourReservations": "View your reservations",
          "logout": "Logout",
          "loadingData": "Loading data...",
          "failedToLogout": "Failed to log out",
          "createZone": "Create a new zone",
          "zoneName": "Zone Name",
          "sensor": "Sensor",
          "errorCreatingZone": "Error creating zone",
          "zoneNameRequired": "Zone name is required",
          "editGym": "Edit Gym",
          "gymName": "Gym Name",
          "address": "Address",
          "errorLoadingGymData": "Error loading gym data",
          "errorEditingGym": "Error editing gym",
          "saveChanges": "Save Changes",
          "editTraining": "Edit Training",
          "loadingTrainingData": "Loading training data...",
          "currentReservations": "Current Reservations",
          "confirmPlaceReduction": "You have reduced the total places to {{totalPlaces}}, which is less than the current number of reservations ({{currentReservations}}). Excess reservations will be removed. Are you sure?",
          "saveTrainingChanges": "Save changes",
          "errorEditingTraining": "Error editing training",
          "errorLoadingZones": "Error loading zones",
          "placesCannotBeLessThanOne": "The number of places cannot be less than one.",
          "gymCoachesTitle": "Coaches working in the gym",
          "noCoachesMessage": "No coaches are working in this gym.",
          "errorLoadingCoaches": "Error loading coach data",
          "confirmDeleteCoach": "Are you sure you want to dismiss this coach? All their trainings and reservations will also be deleted.",
          "errorDeletingCoach": "Error dismissing the coach",
          "deleteCoach": "Dismiss coach",
          "userEmail": "User's email",
          "backToAllGyms": "Back to all gyms",
          "noGymsAvailable": "No gyms available",
          "allGymsList": "List of all gyms",
          "noTrainingsInGym": "There are no scheduled trainings in this gym.",
          "errorLoadingTrainingData": "Error loading training data.",
          "reservationSuccess": "You have successfully reserved a spot for the training.",
          "reservationError": "Error reserving for the training.",
          "confirmCancelReservation": "Are you sure you want to cancel your reservation for this training?",
          "cancelReservationSuccess": "You have successfully canceled your reservation.",
          "cancelReservationError": "Error canceling the reservation.",
          "youAreReserved": "You are reserved",
          "reserve": "Reserve",
          "noPlaces": "No places available",
          "trainingsInGym": "Trainings in gym {{gymName}}",
          "errorFetchingCsrfToken": "Error fetching CSRF token",
          "noZonesInGym": "There are no zones in this gym.",
          "failedToFetchData": "Failed to fetch data",
          "errorFetchingData": "Error fetching data",
          "confirmDeleteZone": "Are you sure you want to delete this zone? This action cannot be undone.",
          "errorDeletingZone": "Error deleting the zone",
          "zonesInGym": "Zones in Gym",
          "addZone": "Add Zone",
          "viewTrainingsInZone": "View trainings in zone",
          "viewSensorData": "View sensor data",
          "editZone": "Edit zone",
          "deleteZone": "Delete zone",
          "networkResponseNotOk": "Network response was not ok",
          "loginSuccessful": "Login successful",
          "loginFailed": "Login failed",
          "fetchFailed": "Failed to fetch",
          "error": "Error",
          "login": "Login",
          "register": "Register",
          "pleaseSelectRole": "Please select a role.",
          "registrationSuccessful": "Registration successful",
          "unexpectedError": "An unexpected error occurred. Please try again later.",
          "sensorData": "Sensor data",
          "sensorId": "Sensor ID",
          "temperature": "Temperature",
          "humidity": "Humidity",
          "noise": "Noise level",
          "loadingSensorData": "Loading sensor data...",
          "failedToFetchSensorData": "Failed to fetch sensor data",
          "errorFetchingTrainingDetails": "There was an error fetching the training details!",
          "errorFetchingTrainings": "There was an error fetching the trainings!",
          "trainings": "Trainings",
          "errorFetchingZoneDetails": "There was an error fetching the zone details!",
          "password": "Password",
          "selectRole": "Select role",
          "goToLogin": "Login",
          "yourTrainings": "Your trainings",
          "inGym": "in gym",
          "inZone": "in zone",
          "yourGymsList": "Your gyms",
          "viewZones": "View zones",
          "viewCoaches": "View coaches",
          "deleteGym": "Delete gym",
          "addNewGym": "Add new gym",
          "sensorIdOptional": "Sensor ID (optional)",
          "noGymsYet": "You have no gyms yet",
          "createNewGym": "Create new gym",
          "createGym": "Create",
          "inAllGyms": "in all gyms",
        }
      },
      ua: {
        translation: {
          "addCoach": "Додати тренера",
          "coachEmail": "Email тренера",
          "errorAddingCoach": "Сталася помилка під час додавання тренера",
          "coachAddedSuccessfully": "Тренера успішно додано",
          "connectionError": "Помилка при з'єднанні з сервером. Перевірте ваше з'єднання і спробуйте ще раз.",
          "add": "Додати",
          "back": "Назад",
          "addTraining": "Додати тренування",
          "trainingName": "Назва тренування",
          "description": "Опис",
          "date": "Дата",
          "startTime": "Час початку",
          "endTime": "Час закінчення",
          "totalPlaces": "Кількість місць",
          "gym": "Зал",
          "zone": "Зона",
          "selectGym": "Виберіть зал",
          "selectZone": "Виберіть зону",
          "startDateInPast": "Дата та час початку тренування не можуть бути в минулому.",
          "endTimeBeforeStart": "Час закінчення повинен бути пізніше часу початку.",
          "errorCreatingTraining": "Помилка при створенні тренування",
          "trainingAddedSuccessfully": "Тренування успішно додано",
          "failedToAddTraining": "Не вдалося додати тренування",
          "errorOccurred": "Виникла помилка",
          "homepage": "Домашня сторінка",
          "clientReservationsTitle": "Список тренувань, на які ви записані",
          "loading": "Завантаження...",
          "noReservations": "Ви не записані ні на одне тренування.",
          "errorLoadingReservations": "Помилка при завантаженні даних про записи.",
          "cancelReservation": "Відмінити запис",
          "reservationCancelled": "Запис на тренування відмінено.",
          "errorCancellingReservation": "Помилка при відміні запису.",
          "remainingPlaces": "Залишилось місць",
          "coachGymsTitle": "Список усіх залів, де ви працюєте",
          "noGymsMessage": "У вас немає залів, в яких ви працюєте.",
          "errorLoadingGyms": "Помилка при завантаженні даних залів.",
          "viewGymTrainings": "Подивитися тренування в залі",
          "viewGymZones": "Подивитися зони",
          "resign": "Звільнитися",
          "resignConfirmation": "Ви впевнені, що хочете звільнитися з цього залу? Цю дію не можна буде скасувати.",
          "resignError": "Помилка при звільненні з залу.",
          "noGymsLeftMessage": "У вас більше немає залів, в яких ви працюєте.",
          "coachTrainingsTitle": "Ваші тренування",
          "errorLoadingUserData": "Помилка при завантаженні даних користувача",
          "fetchDataError": "Не вдалося завантажити дані",
          "deleteTraining": "Видалити тренування",
          "deleteTrainingConfirmation": "Ви впевнені, що хочете видалити це тренування? Цю дію не можна буде скасувати.",
          "deleteTrainingError": "Помилка при видаленні тренування",
          "addTrainingButton": "Додати тренування",
          "editTrainingButton": "Редагувати тренування",
          "welcomeToGymManager": "Ласкаво просимо до Gym Manager",
          "role": "Роль",
          "owner": "Власник",
          "coach": "Тренер",
          "client": "Клієнт",
          "username": "Ім'я користувача",
          "email": "Електронна пошта",
          "viewYourGyms": "Переглянути ваші зали",
          "viewYourGymsAsCoach": "Переглянути всі зали, де ви працюєте",
          "viewYourTrainingsAsCoach": "Переглянути всі ваші тренування",
          "viewAllGyms": "Переглянути всі зали",
          "viewYourReservations": "Переглянути ваші записи",
          "logout": "Вийти",
          "loadingData": "Завантаження даних...",
          "failedToLogout": "Не вдалося вийти",
          "createZone": "Створити нову зону",
          "zoneName": "Назва зони",
          "sensor": "Датчик",
          "errorCreatingZone": "Помилка при створенні зони",
          "zoneNameRequired": "Назва зони обов'язкова",
          "editGym": "Редагувати зал",
          "gymName": "Назва залу",
          "address": "Адреса",
          "errorLoadingGymData": "Помилка при завантаженні даних залу",
          "errorEditingGym": "Помилка при редагуванні залу",
          "saveChanges": "Зберегти зміни",
          "editTraining": "Редагувати тренування",
          "loadingTrainingData": "Завантаження даних тренування...",
          "currentReservations": "Поточні записи",
          "confirmPlaceReduction": "Ви зменшили кількість місць до {{totalPlaces}}, що менше поточного числа записів ({{currentReservations}}). Зайві записи будуть видалені. Ви впевнені?",
          "saveTrainingChanges": "Зберегти зміни",
          "errorEditingTraining": "Помилка при редагуванні тренування",
          "errorLoadingZones": "Помилка при завантаженні зон",
          "placesCannotBeLessThanOne": "Кількість місць не може бути меншою за одне.",
          "gymCoachesTitle": "Тренери, що працюють у залі",
          "noCoachesMessage": "У цьому залі немає тренерів.",
          "errorLoadingCoaches": "Помилка при завантаженні даних тренерів",
          "confirmDeleteCoach": "Ви впевнені, що хочете звільнити цього тренера? Всі його тренування та записи на них також будуть видалені.",
          "errorDeletingCoach": "Помилка при звільненні тренера",
          "deleteCoach": "Звільнити тренера",
          "userEmail": "Електронна пошта користувача",
          "backToAllGyms": "Назад до всіх залів",
          "noGymsAvailable": "Немає доступних залів",
          "allGymsList": "Список усіх залів",
          "noTrainingsInGym": "У цьому залі немає запланованих тренувань.",
          "errorLoadingTrainingData": "Помилка при завантаженні даних тренувань.",
          "reservationSuccess": "Ви успішно записалися на тренування.",
          "reservationError": "Помилка при записі на тренування.",
          "confirmCancelReservation": "Ви впевнені, що хочете скасувати запис на це тренування?",
          "cancelReservationSuccess": "Ви успішно скасували запис на тренування.",
          "cancelReservationError": "Помилка при скасуванні запису.",
          "youAreReserved": "Ви записані",
          "reserve": "Записатися",
          "noPlaces": "Місць немає",
          "trainingsInGym": "Тренування в залі {{gymName}}",
          "errorFetchingCsrfToken": "Помилка при отриманні CSRF токену",
          "noZonesInGym": "У цьому залі немає зон.",
          "failedToFetchData": "Не вдалося отримати дані",
          "errorFetchingData": "Помилка при отриманні даних",
          "confirmDeleteZone": "Ви впевнені, що хочете видалити цю зону? Цю дію не можна буде скасувати.",
          "errorDeletingZone": "Помилка при видаленні зони",
          "zonesInGym": "Зони у залі",
          "addZone": "Додати зону",
          "viewTrainingsInZone": "Переглянути тренування в зоні",
          "viewSensorData": "Переглянути дані датчика",
          "editZone": "Редагувати зону",
          "deleteZone": "Видалити зону",
          "networkResponseNotOk": "Мережевий запит не був успішним",
          "loginSuccessful": "Успішний вхід",
          "loginFailed": "Не вдалося увійти",
          "fetchFailed": "Помилка завантаження",
          "error": "Помилка",
          "login": "Увійти",
          "register": "Зареєструватися",
          "pleaseSelectRole": "Будь ласка, виберіть роль.",
          "registrationSuccessful": "Реєстрація пройшла успішно",
          "unexpectedError": "Сталася несподівана помилка. Спробуйте ще раз пізніше.",
          "sensorData": "Дані датчика",
          "sensorId": "ID датчика",
          "temperature": "Температура",
          "humidity": "Вологість",
          "noise": "Рівень шуму",
          "loadingSensorData": "Завантаження даних датчика...",
          "failedToFetchSensorData": "Не вдалося отримати дані датчика",
          "errorFetchingTrainingDetails": "Сталася помилка при завантаженні даних про тренування!",
          "errorFetchingTrainings": "Сталася помилка при завантаженні тренувань!",
          "trainings": "Тренування",
          "errorFetchingZoneDetails": "Сталася помилка при завантаженні даних зони!",
          "password": "Пароль",
          "selectRole": "Оберіть роль",
          "goToLogin": "Увійти",
          "yourTrainings": "Ваші тренування",
          "inGym": "в залі",
          "inZone": "в зоні",
          "yourGymsList": "Ваші зали",
          "viewZones": "Переглянути зони",
          "viewCoaches": "Переглянути тренерів",
          "deleteGym": "Видалити зал",
          "addNewGym": "Додати новий зал",
          "sensorIdOptional": "ID сенсору (опціонально)",
          "noGymsYet": "У вас ще немає спортзалів",
          "createNewGym": "Створити новий зал",
          "createGym": "Створити",
          "inAllGyms": "в усіх залах",
        }
      },
    },
    fallbackLng: 'en',
    detection: {
      order: ['queryString', 'cookie'],
      cache: ['cookie']
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
