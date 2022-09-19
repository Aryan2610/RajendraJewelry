/* eslint-disable */
// DOM ELEMENTS
const signUpForm = document.querySelector('.form--signup');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const productDataForm = document.querySelector('.form-product-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');
const deleteReviewBtn = document.querySelector('.deleteReviewBtn');
const deleteAccountBtn = document.querySelector('.deleteAccount');
const landingLogin = document.querySelector('.landingform--login');
const deleteJewelryBtn = document.querySelector('.deleteTourBtn');
const forgotPasswordForm = document.querySelector('.form--forgotPassword');
const passwordResetForm = document.getElementById('resetPassword');
const priceSelect = document.querySelectorAll('.booked__details');
const total = document.querySelector('.cart-total');
const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });
    if ((res.data.status = 'success')) location.replace('/login');
  } catch (err) {
    console.log(err.response);
    showAlert('error', 'Error logging out! Try again.');
  }
};
const signup = async (name, email, address, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name,
        email,
        address,
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Account created successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const forgotPassword = async (email) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/forgotPassword',
      data: {
        email,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', res.data.message);
      const token = res.data.resetURL.split('resetPassword/')[1];
      // window.setTimeout(() => {
      //   location.assign(`/password-reset/${token}`);
      // }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
const passwordReset = async (password, confirmPassword) => {
  try {
    const token = document.querySelector('body').dataset.token;
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/resetPassword/${token}`,
      data: {
        password,
        confirmPassword,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Password Reset Successful!');
      window.setTimeout(() => {
        location.assign(`/login`);
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
const deleteJewel = async (jewelryId) => {
  try {
    const url = '/api/v1/jewelry/' + jewelryId;
    const res = await axios({
      method: 'DELETE',
      url,
    });
    showAlert('success', 'Product Deleted successfully!');
    window.setTimeout(() => {
      location.assign('/all-jewelry');
    }, 2000);
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
const deleteItems = async (cartId) => {
  try {
    const url = '/delete-cart' + cartId;
    const res = await axios({
      method: 'DELETE',
      url,
    });
    showAlert('success', 'Product Deleted successfully!');
    window.setTimeout(() => {
      location.assign('/all-jewelry');
    }, 2000);
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const deleteAccount = async () => {
  try {
    const url = '/api/v1/users/deleteMe/';
    const res = await axios({
      method: 'DELETE',
      url,
    });

    if (res.status === 204) {
      showAlert(
        'success',
        `Your Account has been deleted Permanently! We hope to see you back soon.😊`
      );

      window.setTimeout(() => {
        location.assign('/');
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

if (signUpForm)
  document.querySelector('.form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    signup(name, email, address, password, passwordConfirm);
  });

if (loginForm)
  document.querySelector('.form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

if (logOutBtn) logOutBtn.addEventListener('click', logout);
if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    forgotPassword(email);
  });
}
if (passwordResetForm) {
  passwordResetForm.addEventListener('click', (e) => {
    e.preventDefault();

    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    passwordReset(password, confirmPassword);
  });
}
if (deleteAccountBtn) {
  deleteAccountBtn.addEventListener('click', (e) => {
    e.preventDefault();
    deleteAccount();
  });
}

const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage, 7);
if (userDataForm)
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    updateSettings(form, 'data');
  });
if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 5000);
};
const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updateMyPassword'
        : '/api/v1/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

let totalPrice = 0;

priceSelect.forEach((el) => {
  const p = el.innerText.replace(/\₹|,/g, '');
  const price = parseInt(p);
  totalPrice += price;
});
total.textContent = `₹${totalPrice}`;
const bookJewelry = async (userId) => {
  const stripe = Stripe(
    'pk_test_51LTVtQSDljmClvluA4L97YUnAkia2pbFHA9oytKBMk7rosEbE79ucIox6IkjJ2fA2thd3WnaVluhlIoA72hnWDcT00Wpa8F11Z'
  );
  try {
    const session = await axios(
      `/api/v1/bookings/checkout-session/${userId}/${totalPrice}`
    );
    window.location.replace(session.data.session.url);
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
const updateBookings = async (userId) => {
  try {
    const session = await axios(`/update-bookings/${userId}`);
    window.location.replace(session.data.session.url);
  } catch (err) {
    console.log(err);
  }
};
const emptyCart = async () => {
  try {
    await axios(`/delete-cart`);
  } catch (err) {
    console.log(err);
  }
};
if (bookBtn)
  bookBtn.addEventListener('click', async (e) => {
    e.target.textContent = 'Processing...';
    const { userId } = e.target.dataset;
    await updateBookings(userId);
    await bookJewelry(userId);
    emptyCart();
  });
