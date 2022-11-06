import {
  AddOutlined,
  DeleteOutline,
  EditOutlined,
  PlusOneOutlined,
  SaveOutlined,
} from "@mui/icons-material";
import {
  Alert,
  AlertColor,
  AppBar,
  Backdrop,
  Button,
  Card,
  CardHeader,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogTitle,
  Modal,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useEffect, useState } from "react";
import studentAPI from "../apis/student.api";
import { Student } from "../models/student.dto";

export default function Home() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [alertColor, setAlertColor] = useState<AlertColor>("success");
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [action, setAction] = useState<"create" | "update">("create");
  const [selectedStudent, setSelectedStudent] = useState<Student>(
    new Student(0, "Name", 18)
  );
  const [formModalOpen, setFormModalOpen] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<Student>({
    id: 0,
    name: "",
    age: 18,
  });

  const validationSchema = yup.object({
    name: yup.string().min(3).required(),
    age: yup.number().min(6).max(125).required(),
  });

  const onSubmit = async (student: Student) => {
    try {
      if (action == "create") {
        formik.setValues(new Student(0, "", 18));
      } else {
        formik.setValues(selectedStudent);
      }

      setFormModalOpen(false);
      setLoading(true);
      if (action == "create") await studentAPI.create(student);
      else await studentAPI.update({ ...student, id: selectedStudent.id });
      await fetchData();
      setLoading(false);
      showSnackbar("Амжилттай", "success");
    } catch (error) {
      setLoading(false);
      console.log("ERROR", error);
      showSnackbar("Амжилтгүй", "error");
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: onSubmit,
  });

  const fetchData = async () => {
    setLoading(true);
    const res = await studentAPI.list();
    setStudents(res.data);
    setLoading(false);
  };

  const onDelete = async (id: number) => {
    setSelectedStudent(new Student(id, "", 0));
    setDeleteDialogOpen(true);
  };

  const deleteStudent = async (id: number) => {
    try {
      setDeleteDialogOpen(false);
      setLoading(true);
      await studentAPI.remove(id);
      await fetchData();
      setLoading(false);
      showSnackbar("Амжилттай устаглаа", "success");
    } catch (error) {
      setLoading(false);
      console.log("ERROR", error);
      showSnackbar("Амжилтгүй", "error");
    }
  };

  const showSnackbar = (message: string, color: AlertColor) => {
    setSnackbarOpen(true);
    setAlertColor(color);
    setAlertMessage(message);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container>
      <AppBar color="primary">
        <Toolbar>
          <Typography>Оюутан</Typography>
          <Button
            color="warning"
            onClick={() => {
              setAction("create");
              setFormModalOpen(true);
            }}
          >
            <AddOutlined />
          </Button>
        </Toolbar>
      </AppBar>
      <Card style={{ paddingTop: "5rem" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Нэр</TableCell>
                <TableCell>Нас</TableCell>
                <TableCell>Үйлдэл</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((e, i) => (
                <TableRow key={e.id + i}>
                  <TableCell>{e.id}</TableCell>
                  <TableCell>{e.name}</TableCell>
                  <TableCell>{e.age}</TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      onClick={() => {
                        setAction("update");
                        setSelectedStudent(new Student(e.id, e.name, e.age));
                        setFormModalOpen(true);
                      }}
                    >
                      <EditOutlined />
                    </Button>
                    <Button
                      type="button"
                      color="error"
                      onClick={() => onDelete(e.id)}
                    >
                      <DeleteOutline color="error" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      <Modal open={formModalOpen} onClose={() => setFormModalOpen(false)}>
        <div
          style={{
            maxWidth: "620px",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Card>
            <form
              onSubmit={formik.handleSubmit}
              style={{
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <TextField
                fullWidth
                id="name"
                name="name"
                label="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
              <TextField
                fullWidth
                type={"number"}
                id="age"
                name="age"
                label="age"
                value={formik.values.age}
                onChange={formik.handleChange}
                error={formik.touched.age && Boolean(formik.errors.age)}
                helperText={formik.touched.age && formik.errors.age}
              />
              <Button type="submit" fullWidth startIcon={<SaveOutlined />}>
                Хадаглах
              </Button>
            </form>
          </Card>
        </div>
      </Modal>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">
          Та устгах даа итгэлтэй байна уу?
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => deleteStudent(selectedStudent.id)}>
            Тийм
          </Button>
          <Button onClick={() => setDeleteDialogOpen(false)}>Үгүй</Button>
        </DialogActions>
      </Dialog>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          severity={alertColor}
          onClose={() => setSnackbarOpen(false)}
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
