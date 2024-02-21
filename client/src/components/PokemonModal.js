import Box from "@mui/material/Box";
import { FormProvider, FTextField } from "./form";
import Modal from "@mui/material/Modal";

import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { alpha, Stack, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { addPokemon, editPokemon } from "../features/pokemons/pokemonSlice";
import { useNavigate } from "react-router-dom";

import { fakerVI as faker } from "@faker-js/faker";
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

const defaultValues = {
  name: "",
  id: "",
  url: "",
  type1: "",
  type2: "",
};

export default function PokemonModal({ open, setOpen, option }) {
  const navigate = useNavigate();
  const methods;
  if (option === "create") {
methods = useForm(defaultValues)};

  }
  if (option === "update") {
    palStat();
  }


  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const dispatch = useDispatch();
  const {pokemon} = useSelector((state) => (state.pokemon));
const ogId = pokemon.id;

  const onSubmit = (data) => {
    const { name, id, url, type1, type2 } = data;
    if (option === "create") {
      dispatch(addPokemon({ name, id, imgUrl: url, types: [type1, type2] }));
    }
    if (option === "update") {
      dispatch(editPokemon({ogId, name, id, imgUrl: url, types: [type1, type2] }));
      console.log("update pal - SUBMITTING...");
    }
     setOpen(false);
     navigate(`/pokemons/${id}`);
  };

  const handleClose = () => setOpen(false);

  function generateRandomPal() {
    const pokemonTypes = [
      "bug",
      "dragon",
      "fairy",
      "fire",
      "ghost",
      "ground",
      "normal",
      "psychic",
      "steel",
      "dark",
      "electric",
      "fighting",
      "flying",
      "grass",
      "ice",
      "poison",
      "rock",
      "water",
    ];
    const sample = (arr) => {
      const len = arr == null ? 0 : arr.length;
      return len ? arr[Math.floor(Math.random() * len)] : undefined;
    };
    return {
      id: faker.number.int({ min: 800, max: 999 }),
      name: faker.person.firstName(),
      types: [sample(pokemonTypes), sample(pokemonTypes)],
      url: faker.image.url({ width: 256, height: 256 }),
    };
  }

  const Palomize = () => {
    const pal = generateRandomPal();
    methods.setValue("name", pal.name);
    methods.setValue("id", pal.id);
    methods.setValue("url", pal.url);
    methods.setValue("type1", pal.types[0]);
    methods.setValue("type2", pal.types[1]);
  };

  const palStat = () => {
    methods.setValue("name", pokemon.name);
    methods.setValue("id", pokemon.id);
    methods.setValue("url", pokemon.url);
    methods.setValue("type1",pokemon.types[0]);
    methods.setValue("type2", pokemon.types[1] ? pokemon.types[1]: "");
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
                // rows={4}
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
                  {option} Pokemon
                </LoadingButton>
              </Box>
            </Stack>
          </FormProvider>
        </Box>
      </Modal>
    </div>
  );
}
