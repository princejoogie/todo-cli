import React, { useState } from "react";
import { Text, Box, useInput } from "ink";
import { todoService } from "./services/todo";
import { useMutation, useQuery } from "./hooks";

type Mode = "normal" | "insert";

const App = () => {
  const [pos, setPos] = useState(0);
  const [mode, setMode] = useState<Mode>("normal");
  const [input, setInput] = useState("");

  const todos = useQuery(["todos"], todoService.getAll);

  const create = useMutation(todoService.create, {
    onSuccess: () => {
      todos.refetch();
      setInput("");
    },
  });

  const toggle = useMutation(todoService.toggle, {
    onSuccess: todos.refetch,
  });

  const deleteOne = useMutation(todoService.deleteById, {
    onSuccess: todos.refetch,
  });

  useInput((char, key) => {
    if (mode === "normal") {
      if (char === "R") {
        todos.refetch();
      } else if (char === "a") {
        setMode("insert");
      } else if (char === "j") {
        setPos((e) => {
          if (todos.data && e < todos.data?.length - 1) return e + 1;
          return e;
        });
      } else if (char === "k") {
        setPos((e) => {
          if (e > 0) return e - 1;
          return e;
        });
      } else if (char === "x" || char === "X") {
        if (todos.data && todos.data[pos]) {
          deleteOne.mutate({ where: { id: todos.data[pos]?.id } });
        }
      } else if (key.return) {
        const _data = todos.data?.[pos];
        if (_data) {
          toggle.mutate({
            id: _data.id,
            done: _data.done,
          });
        }
      }
    } else if (mode === "insert") {
      if (key.backspace || key.delete) {
        setInput((e) => e.slice(0, -1));
      } else if (key.return) {
        create.mutate({ content: input });
      } else if (key.escape) {
        setMode("normal");
      } else {
        setInput((e) => `${e}${char}`);
      }
    }
  });

  return (
    <Box flexDirection="column" alignItems="center" justifyContent="center">
      <Box flexDirection="column" alignItems="flex-start">
        <Box
          marginTop={2}
          marginBottom={1}
          paddingX={1}
          borderStyle="round"
          minWidth={30}
          borderColor={mode === "insert" ? "#ffffff" : "#4b5563"}
        >
          <Text>
            INPUT: <Text color="green">{input}</Text>
          </Text>
        </Box>

        {todos.data && todos.data.length > 0 ? (
          todos.data?.map((todo, idx) => {
            const active = pos === idx && mode === "normal";
            return (
              <Box key={todo.id} width="100%">
                <Text
                  backgroundColor={active ? "#1f2937" : undefined}
                  color="#ffffff"
                >
                  {todo.done ? "☒" : "☐"} {todo.content}
                </Text>
              </Box>
            );
          })
        ) : (
          <Text color="#ffffff">No todos</Text>
        )}
      </Box>
    </Box>
  );
};

export default App;
