import Box from "@mui/material/Box";
import { FormProvider, FTextField } from "./form";
import Modal from "@mui/material/Modal";

import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { alpha, Stack, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { addPokemon, editPokemon } from "../features/pokemons/pokemonSlice";
import { useNavigate, useParams } from "react-router-dom";

import { useState, useEffect } from "react";

import { generateRandomPal } from "../components/randomPal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function PokemonModal({ open, setOpen, opt, setOpt }) {
  console.log("🚀 ~ PokemonModal ~ opt:", opt);
  const { pokemon } = useSelector((state) => state.pokemons.pokemon);
  const { id: ogId } = useParams();
  console.log("🚀 ~ PokemonModal ~ ogId :", ogId);
  const navigate = useNavigate();
  const [defaultValues, setDefaultValues] = useState({
    name: "",
    id: "",
    url: "",
    type1: "",
    type2: "",
  });
  const methods = useForm({ defaultValues });
  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = methods;

  useEffect(() => {
    if (opt === "update" && pokemon) {
      setValue("name", pokemon.name);
      setValue("id", pokemon.id);
      setValue("url", pokemon.url);
      setValue("type1", pokemon.types[0] || "");
      setValue("type2", pokemon.types[1] || "");
    } else {
      setValue("name", "");
      setValue("id", "");
      setValue("url", "");
      setValue("type1", "");
      setValue("type2", "");
    }
  }, [opt, pokemon, setValue]);

  const dispatch = useDispatch();

  const onSubmit = (data) => {
    const { name, id, url, type1, type2 } = data;
    if (opt === "create") {
      dispatch(addPokemon({ name, id, imgUrl: url, types: [type1, type2] }));
    }
    if (opt === "update") {
      dispatch(
        editPokemon({ ogId, name, id, imgUrl: url, types: [type1, type2] })
      );
      console.log("update pal - SUBMITTING...");
    }
    setOpen(false);
    navigate(`/pokemons/${id}`);
  };

  const handleClose = () => setOpen(false);

  const Palomize = () => {
    const pal = generateRandomPal();
    setValue("name", pal.name);
    setValue("id", pal.id);
    setValue("url", pal.url);
    setValue("type1", pal.types[0]);
    setValue("type2", pal.types[1]);
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <FTextField
                name="name"
                fullWidth
                rows={4}
                placeholder="Name"
                sx={{
                  "& fieldset": {
                    borderWidth: `1px !important`,
                    borderColor: alpha("#919EAB", 0.32),
                  },
                }}
              />
              <FTextField
                name="id"
                fullWidth
                rows={4}
                placeholder="Id"
                sx={{
                  "& fieldset": {
                    borderWidth: `1px !important`,
                    borderColor: alpha("#919EAB", 0.32),
                  },
                }}
              />
              <FTextField
                name="url"
                fullWidth
                rows={4}
                placeholder="Image Url"
                sx={{
                  "& fieldset": {
                    borderWidth: `1px !important`,
                    borderColor: alpha("#919EAB", 0.32),
                  },
                }}
              />
              <FTextField
                name="type1"
                fullWidth
                rows={4}
                placeholder="Type 1"
                sx={{
                  "& fieldset": {
                    borderWidth: `1px !important`,
                    borderColor: alpha("#919EAB", 0.32),
                  },
                }}
              />
              <FTextField
                name="type2"
                fullWidth
                rows={4}
                placeholder="Type 2"
                sx={{
                  "& fieldset": {
                    borderWidth: `1px !important`,
                    borderColor: alpha("#919EAB", 0.32),
                  },
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                }}
              >
                <Button
                  variant="contained"
                  size="small"
                  color="error"
                  onClick={Palomize}
                >
                  Randomize Pal
                </Button>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  size="small"
                  loading={
                    isSubmitting
                    // || isLoading
                  }
                >
                  {opt} Pokemon
                </LoadingButton>
              </Box>
            </Stack>
          </FormProvider>
        </Box>
      </Modal>
    </div>
  );
}
