// customComponents.ts
import { OptionList } from "@/components/ui/option-list"; // 引入 OptionList 组件
import { Plan } from "@/components/ui/plan"; // 引入 Plan 组件

// 你可以继续添加其他自定义组件
const customComponents = [
  {
    name: 'optionlist',
    component: (props: any) => {
      const get = (k: string) => props[k] ?? props[k.toLowerCase()];

      const parseProps = (prop: any, defaultValue: any = []) => {
        if (typeof prop === "string") {
          try {
            const clean = prop.replace(/&quot;/g, '"').replace(/&#x27;/g, "'");
            return JSON.parse(clean);
          } catch (e) {
            console.warn("Failed to parse JSON:", prop, e);
            return defaultValue;
          }
        }
        return prop ?? defaultValue;
      };

      const options = parseProps(get("options"));
      const responseActions = parseProps(get("responseActions"));

      return (
        <OptionList
          options={options}
          selectionMode={get("selectionMode") || get("selectionmode") || "single"}
          maxSelections={get("maxSelections") ? parseInt(get("maxSelections"), 10) : undefined}
          responseActions={responseActions}
          onConfirm={(selection) => console.log("Selected options:", selection)}
          className={get("className")}
        />
      );
    }
  },
  {
  name: 'plan1',
  component: (props: any) => {
    console.log("Plan component props:", props); // 确保 props 传递正确
    debugger;  // 在这里停下看看具体情况
    const get = (k: string) => props[k] ?? props[k.toLowerCase()];

    const parseProps = (prop: any, defaultValue: any = []) => {
      if (typeof prop === "string") {
        try {
          const clean = prop.replace(/&quot;/g, '"').replace(/&#x27;/g, "'");
          return JSON.parse(clean);
        } catch (e) {
          console.warn("Failed to parse JSON:", prop, e);
          return defaultValue;
        }
      }
      return prop ?? defaultValue;
    };

    const todos = parseProps(get("todos"));

    return (
      <Plan
        id={get("id") || ""}
        title={get("title") || ""}
        description={get("description") || ""}
        todos={todos}
        className={get("className")}
      />
    );
  }
}
  // 这里可以继续添加更多的自定义组件
];

export default customComponents;
