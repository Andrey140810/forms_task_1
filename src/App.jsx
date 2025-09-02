import { useState, useRef, useEffect, useCallback } from 'react'
import styles from './App.module.css'

export function App() {
	const [formData, setFormData] = useState({email: '', password: '', repeatPassword: ''})
	const [errors, setErrors] = useState({email: null, password: null, repeatPassword: null})

	const submitButtonRef = useRef(null)

	const isEmailValid = useCallback((email) => {
		if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/.test(email)) {
			return 'Неверный email. Проверьте ваш email на соответствие RFC 5322'
		}
		return null
	}, [])

	const isPasswordValid = useCallback((password) => {
		if (!/(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
			return 'Некорректный пароль. Пароль должен содержать хотя бы 1 строчную и 1 заглавную букву'
		}
		if (!/(?=.*\d)(?=.*[!@#$%^&*])/.test(password)) {
			return 'Некорректный пароль. Пароль должен содержать хотя бы 1 цифру и символ !@#$%^&*'
		}
		if (password.length < 8) {
			return 'Некорректный пароль. Пароль должен быть не менее 8 символов'
		}
		return null
	}, [])

	const validateField = useCallback((name, value, passwordValue = formData.password) => {
		switch (name) {
			case 'email':
				return isEmailValid(value)
			case 'password':
				return isPasswordValid(value)
			case 'repeatPassword':
				if (!value) return 'Ошибка. Повторите пароль'
				if (passwordValue !== value) return 'Некорректный повтор пароля. Пароли должны совпадать'
				return null
			default:
				return null
		}
	}, [formData.password, isEmailValid, isPasswordValid])

	const onHandleChange = (e) => {
		const { name, value } = e.target
		setFormData(form => ({...form, [name]: value}))

		if (errors[name]) {
			setErrors(error => ({...error, [name]: null}))
		}

		if (name === 'password') {
			const repeatPass = formData.repeatPassword
			if (repeatPass) {
				const repeatError = validateField('repeatPassword', repeatPass, value)
				setErrors(error => ({...error, repeatPassword: repeatError}))
			}
		}
	}

	const onHandleBlur = (e) => {
		const { name, value } = e.target
		const newError = validateField(name, value)
		setErrors(error => ({...error, [name]: newError}))
	}

	const onSubmit = (event) => {
		event.preventDefault()

		const newErrors = Object.fromEntries(
			Object.keys(formData).map(key => [key, validateField(key, formData[key])])
		)

		setErrors(newErrors)

		if (Object.values(newErrors).some(error => error !== null)) return

		console.log(formData.email, formData.password, formData.repeatPassword)
	}

	useEffect(() => {
		const { email, password, repeatPassword } = formData

		const isEmailValidResult = isEmailValid(email)
		const isPasswordValidResult = isPasswordValid(password)
		const passwordsMatch = password && password === repeatPassword

		if (!isEmailValidResult && !isPasswordValidResult && passwordsMatch) {
			submitButtonRef.current?.focus()
		}
	}, [formData, isEmailValid, isPasswordValid])

	const isFormValid = Object.values(errors).every(error => error === null)

  return (
    <div className={styles.app}>
		<form className={styles.formLabel} onSubmit={onSubmit}>Новый пользователь
			{errors.email && <div className={styles.errorLabel}>{errors.email}</div>}
			{errors.password && <div className={styles.errorLabel}>{errors.password}</div>}
			{errors.repeatPassword && <div className={styles.errorLabel}>{errors.repeatPassword}</div>}
			<input name='email' type="text" value={formData.email} placeholder='Email' onChange={onHandleChange} onBlur={onHandleBlur} />
			<input name='password' type="password" value={formData.password} placeholder='Пароль' onChange={onHandleChange} onBlur={onHandleBlur} />
			<input name='repeatPassword' type="password" value={formData.repeatPassword} placeholder='Повторите пароль' onChange={onHandleChange} onBlur={onHandleBlur} />
			<button ref={submitButtonRef} type='submit' disabled={!isFormValid}>Зарегистрироваться</button>
		</form>
	</div>
  )
}
