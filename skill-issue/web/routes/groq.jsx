import { useFindMany } from "@gadgetinc/react";
import { Container, Row, Col, Table, Button, Alert, Spinner } from "react-bootstrap";
import { useState } from "react";
import { api } from "../api";
import { useGroq } from "../hooks/useGroq";

export default function() {
  const [{ data: todos, fetching: fetchingTodos, error: todosError }] = useFindMany(api.todo, {
    select: {
      id: true,
      taskName: true,
      skill: true,
      score: true,
      isCompleted: true
    }
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const analyzeWithGroq = useGroq();

  const handleAnalyze = async () => {
    if (!todos || todos.length === 0) return;
    
    setIsAnalyzing(true);
    try {
      const results = await analyzeWithGroq(todos.map(t => t.taskName).join('\n'));
      setAnalysisResults(results);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (fetchingTodos) {
    return (
      <Container className="mt-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (todosError) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          Error loading tasks: {todosError.message}
        </Alert>
      </Container>
    );
  }
 
  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h2>Task Analysis</h2>
          <Button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing || !todos || todos.length === 0}
            className="mb-3"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Tasks'}
          </Button>
        </Col>
      </Row>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Task Name</th>
            <th>Skill</th>
            <th>Current Score</th>
            <th>Analysis Result</th>
          </tr>
        </thead>
        <tbody>
          {todos && todos.map((todo) => (
            <tr key={todo.id}>
              <td>{todo.taskName}</td>
              <td>{todo.skill}</td>
              <td>{todo.score}</td>
              <td>{isAnalyzing ? <Spinner animation="border" size="sm" /> : (analysisResults && analysisResults[todo.id])}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}