import { Container } from "@mui/material";
import "./App.css";
import { TerraformPlan } from "./pages/terraform/plan";
import { BusyComponent } from "./components/busy";

function App(): JSX.Element {
  return (
    <BusyComponent>
      <Container maxWidth="lg">
        <TerraformPlan />
      </Container>
    </BusyComponent>
  )
}

export default App;
