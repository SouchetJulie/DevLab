import axios, { AxiosError, AxiosResponse } from "axios";
import { Formik } from "formik";
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import Link from "next/link";
import { FunctionComponent, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import * as yup from "yup";
import { useAppDispatch } from "@hooks/store-hook";
import { addAlert } from "@stores/alert.store";
import { setUser } from "@stores/user.store";
import styles from "@styles/Auth/Login.Component.module.scss";
import { UserApiResponse } from "@typing/api-response.interface";
import { IUserCreate } from "@typing/user.interface";
import { getAxiosErrorMessage } from "../../utils/get-axios-error.utils";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { FormikHelpers } from "formik/dist/types";

const userCreateSchema = yup.object({
  email: yup
    .string()
    .defined()
    .min(1, "Veuillez entrer un email valide.")
    .email(),
  password: yup.string().defined().min(1, "Veuillez entrer un mot de passe."),
  passwordConfirm: yup
    .string()
    .defined()
    .oneOf(
      [yup.ref("password"), null],
      "Les mots de passe doivent être les mêmes."
    ),
  firstName: yup.string().optional(),
  lastName: yup.string().optional(),
});

type UserCreateSchema = yup.InferType<typeof userCreateSchema>;

const SignupForm: FunctionComponent = () => {
  // store
  const dispatch = useAppDispatch();
  // router
  const router = useRouter();
  // Form validation
  const initialValues = {
    email: "",
    password: "",
    passwordConfirm: "",
    firstName: "",
    lastName: "",
  };
  const [buttonMessage, setButtonMessage] = useState("S'inscrire");

  const onSubmit = async (
    values: UserCreateSchema,
    { setSubmitting }: FormikHelpers<UserCreateSchema>
  ): Promise<void> => {
    const user: IUserCreate = {
      email: values.email,
      password: values.password,
      firstName: values.firstName,
      lastName: values.lastName,
    };

    let success: boolean = true;
    let message = "Traitement en cours...";
    setButtonMessage(message);

    axios
      .post<UserApiResponse>("/api/user/signup", user)
      .then(({ data }: AxiosResponse<UserApiResponse>) => {
        setSubmitting(false);

        success = true;
        message = "Inscription réussie !";
        setButtonMessage(message);
        dispatch(addAlert({ message, success, ttl: 2000 }));

        router.push("/");
        dispatch(setUser(data.user));
      })
      .catch((error: AxiosError) => {
        setSubmitting(false);

        success = false;
        setButtonMessage("Inscription échouée.");
        message = `L'inscription a échouée : ${getAxiosErrorMessage(error)}`;
        dispatch(addAlert({ message, success }));
      });
  };

  useEffect(() => {
    // Prefetch the dashboard page
    router.prefetch("/");
  }, []);

  return (
    <Formik
      validationSchema={userCreateSchema}
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      {({ handleSubmit, handleChange, touched, isValid, errors, dirty }) => (
        <div className={styles.cardWrapper}>
          <div className={styles.cardContainer}>
            <Link href="/">
              <FontAwesomeIcon icon={faTimes} className={styles.cancelIcon} />
            </Link>
            <h2>Nous rejoindre</h2>
            <Form
              noValidate
              onSubmit={handleSubmit}
              className={styles.loginForm}
            >
              {/* Email */}
              <Form.Group controlId="email">
                <Form.Label className="visually-hidden">Email :</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  name="email"
                  isInvalid={touched.email && !!errors.email}
                  isValid={touched.email && !errors.email}
                  className={styles.loginInput}
                  placeholder="Adresse email"
                  type="email"
                />
              </Form.Group>
              {/* Password */}
              <Form.Group controlId="password">
                <Form.Label className="visually-hidden">
                  Mot de passe :
                </Form.Label>
                <Form.Control
                  onChange={handleChange}
                  name="password"
                  isInvalid={touched.password && !!errors.password}
                  isValid={touched.password && !errors.password}
                  className={styles.loginInput}
                  placeholder="Mot de passe"
                  type="password"
                />
              </Form.Group>
              {/* Password confirmation */}
              <Form.Group controlId="passwordConfirm">
                <Form.Label className="visually-hidden">
                  Répétez le mot de passe :
                </Form.Label>
                <Form.Control
                  onChange={handleChange}
                  name="passwordConfirm"
                  isInvalid={
                    touched.passwordConfirm && !!errors.passwordConfirm
                  }
                  isValid={touched.passwordConfirm && !errors.passwordConfirm}
                  className={styles.loginInput}
                  placeholder="Répétez le mot de passe"
                  type="password"
                />
              </Form.Group>
              <Row as="fieldset">
                {/* First name */}
                <Form.Group as={Col} controlId="firstName">
                  <Form.Label className="visually-hidden">
                    Entrez votre prénom :
                  </Form.Label>
                  <Form.Control
                    onChange={handleChange}
                    name="firstName"
                    isInvalid={touched.firstName && !!errors.firstName}
                    isValid={touched.firstName && !errors.firstName}
                    className={styles.loginInput}
                    placeholder="Prénom"
                  />
                </Form.Group>
                {/* Last name */}
                <Form.Group as={Col} controlId="lastName">
                  <Form.Label className="visually-hidden">
                    Entrez votre nom :
                  </Form.Label>
                  <Form.Control
                    onChange={handleChange}
                    name="lastName"
                    isInvalid={touched.lastName && !!errors.lastName}
                    isValid={touched.lastName && !errors.lastName}
                    className={styles.loginInput}
                    placeholder="Nom"
                  />
                </Form.Group>
              </Row>

              {/* Validation */}
              <Button
                className={`${
                  isValid && dirty
                    ? styles.loginValidated
                    : styles.loginButtonSendInvalid
                } ${styles.loginButton}`}
                type="submit"
              >
                {buttonMessage}
              </Button>

              {/* Création de compte -> Redirection */}
              <p className={styles.loginRedirectSignup}>
                <Link href={"/user/signup"}>
                  <a>Déjà un compte ? Se connecter</a>
                </Link>
              </p>
            </Form>
          </div>
        </div>
      )}
    </Formik>
  );
};
export default SignupForm;
