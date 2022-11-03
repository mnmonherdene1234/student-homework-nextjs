import { DeleteOutline } from "@mui/icons-material";
import {
  Backdrop,
  Button,
  Card,
  CircularProgress,
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../apis";
import { Student } from "../models/student";

export default function Home() {
  var name: string;
  var age: number;
  const [students, setStudents] = useState<Student[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  const fetchData = async () => {
    setOpen(true);
    const res = await api.studentAPI.list();
    setStudents(res.data);
    setOpen(false);
  };

  const onSubmit = async () => {
    if (!name || !age) return;
    setOpen(true);
    await api.studentAPI.create(new Student(0, name, age));
    await fetchData();
    setOpen(false);
  };

  const onDelete = async (id: number) => {
    setOpen(true);
    await api.studentAPI.remove(id);
    await fetchData();
    setOpen(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container>
      <Card>
        <div className="form">
          <TextField
            label="Нэр"
            onChange={(e) => (name = e.target.value)}
            variant="standard"
          />
          <TextField
            label="Нас"
            type="number"
            onChange={(e) => (age = parseInt(e.target.value))}
            variant="standard"
          />
          <Button onClick={() => onSubmit()}>Нэмэх</Button>
        </div>
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
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  );
}
