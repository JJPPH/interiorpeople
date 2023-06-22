import React from 'react';

const TodoListTemplate = ({form, children}) => {
  return (
    <main className="todo-list-template">
      <div className="title" style={{ marginLeft:"5%", marginTop: "20px", fontSize:"20px"}}>
        <strong>스타일 편집</strong>
      </div>
      <section className="form-wrapper">
        {form}
      </section>
    </main>
  );
};

export default TodoListTemplate;