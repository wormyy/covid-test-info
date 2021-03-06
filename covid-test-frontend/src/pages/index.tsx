import Head from "next/head";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import { Formik, Field, FormikHelpers, FormikErrors } from "formik";
import { checkResults, TestResult, saveForNotification } from "../api";
import { useState } from "react";
import { rodnecislo } from "rodnecislo";

import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import sk from "date-fns/locale/sk";
registerLocale("sk", sk);
setDefaultLocale("sk");

export interface Patient {
  birthNumber: string;
  email: string;
  testDate: Date;
  // gdpr: boolean;
}

const Home = () => {
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  return (
    <div className="container">
      <Head>
        <title>Covid negative test management</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <Row className="mb-3 mt-3">
          <Col lg={{ span: 6, offset: 3 }}>
            <h1>Overenie negatívneho výsledku testu na Covid-19</h1>
            <p className="mt-3">
              Pre overenie negatívneho výsledku vyplňte následovný formulár.
            </p>
          </Col>
        </Row>

        <Formik<Patient>
          initialValues={{
            birthNumber: "",
            email: "",
            testDate: new Date(),
          }}
          validate={validate}
          onSubmit={async (values: Patient) => {
            if (!values.email) {
              const { test_result } = await checkResults(values);
              return setTestResult(test_result);
            }
            return await saveForNotification(values);
          }}
        >
          {(formikProps) => (
            <>
              <Row className="mb-3">
                <Col lg={{ span: 6, offset: 3 }}>
                  <Form
                    onReset={formikProps.handleReset}
                    onSubmit={formikProps.handleSubmit}
                  >
                    <Form.Group controlId="birthNumber">
                      <Form.Label>Rodné číslo</Form.Label>
                      <Form.Control
                        name="birthNumber"
                        type="text"
                        placeholder="Rodne cislo vo formate 1234567890"
                        onChange={formikProps.handleChange}
                        onBlur={formikProps.handleBlur}
                        value={formikProps.values.birthNumber}
                        isInvalid={
                          formikProps.touched.birthNumber &&
                          !!formikProps.errors.birthNumber
                        }
                      />

                      <Form.Control.Feedback type="invalid">
                        {formikProps.errors.birthNumber}
                      </Form.Control.Feedback>

                      <Form.Text className="text-muted">
                        Vaše rodné číslo je bezpečne zašifrované
                      </Form.Text>
                    </Form.Group>
                    <Form.Group controlId="birthNumber">
                      <Form.Label>Dátum testovania</Form.Label>
                      <DatePicker
                        wrapperClassName="d-block"
                        className="form-control"
                        selected={formikProps.values.testDate}
                        onChange={(date) =>
                          formikProps.setFieldValue("testDate", date)
                        }
                        locale="sk"
                        placeholderText="Weeks start on Monday"
                      />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                      Odoslať
                    </Button>
                  </Form>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col lg={{ span: 6, offset: 3 }}>
                  {testResult === "negative" && (
                    <>
                      <Alert variant="success">
                        Overili sme vašu vzorku a je{" "}
                        <span className="font-weight-bold">negatívna</span>
                      </Alert>
                      <p>
                        Naďalej prosím dodržiavajte platné nariadenia pre
                        ochranu vášho zdravia a ostatných. Pre aktuálne
                        odporúčania navštívte{" "}
                        <a href="https://www.korona.gov.sk/#precautions">
                          www.korona.gov.sk
                        </a>
                        .
                      </p>
                    </>
                  )}
                  {testResult === "notfound" && (
                    <>
                      <Alert variant="info">
                        Vašu vzorku sme nedokázali overiť
                      </Alert>
                      <p>To môže znamenať jednu z nasledujúcich možnosti</p>
                      <ul>
                        <li className="mb-2">
                          Vaša vzorka ešte nebola spracovaná. Nechajte nám na
                          seba kontakt a budeme vás informovať, ak vzorka bude
                          negatívna
                        </li>
                        <Form.Group controlId="email">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            name="email"
                            type="email"
                            placeholder="Váš email"
                            onChange={formikProps.handleChange}
                            onBlur={formikProps.handleBlur}
                            value={formikProps.values.email}
                            isInvalid={
                              formikProps.touched.email &&
                              !!formikProps.errors.email
                            }
                          />

                          <Form.Control.Feedback type="invalid">
                            {formikProps.errors.email}
                          </Form.Control.Feedback>
                          <Button
                            className="mb-3 mt-3"
                            variant="primary"
                            onClick={() => formikProps.handleSubmit()}
                          >
                            Chcem dostať notifikáciu
                          </Button>
                        </Form.Group>

                        <li>
                          Vaša vzorka bola pozitívna. Čakajte prosím na
                          telefonát z príslušného úradu, ktorý vás bude
                          informovať o ďalšom postupe
                        </li>
                      </ul>
                    </>
                  )}
                </Col>
              </Row>
            </>
          )}
        </Formik>
      </Container>

      <style jsx>{``}</style>
    </div>
  );
};

// export const formatRodneCislo = (value: string, withSlash = true) =>
//   value
//     .replace(/\D/g, "")
//     .replace(/^(\d{6})(\d{4})$/, withSlash ? "$1 / $2" : "$1$2");

const validate = (values: Patient) => {
  const errors: Partial<FormikErrors<Patient>> = {};

  if (!values.birthNumber) {
    errors.birthNumber = "Zadajte rodné číslo";
  }
  // } else if (!rodnecislo(values.birthNumber).isValid()) {
  //   errors.birthNumber = "Zadajte platne rodné číslo (bez medzier)";
  // }

  return errors;
};

export default Home;
