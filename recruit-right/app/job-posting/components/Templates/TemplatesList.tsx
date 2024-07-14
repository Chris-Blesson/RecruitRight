import { Button } from "antd";

export interface ITemplate {
  template_name: string;
  company_name: string;
  company_description: string;
  template_id: string;
}

const TemplateCard = ({
  template,
  applyTemplate,
}: {
  template: ITemplate;
  applyTemplate: ({ template }: { template: ITemplate }) => void;
}) => {
  return (
    <div className="rounded-md bg-brown-300 p-4 flex items-center justify-between">
      <h2 className="font-medium">{template.template_name}</h2>
      <Button
        onClick={() => {
          applyTemplate({
            template,
          });
        }}
        type="primary"
      >
        Apply
      </Button>
    </div>
  );
};

const TemplatesList = ({
  templates,
  applyTemplate,
}: {
  templates: ITemplate[];
  applyTemplate: ({ template }: { template: ITemplate }) => void;
}) => {
  return (
    <div className="flex flex-col gap-y-5">
      {templates?.map?.((template) => (
        <TemplateCard
          applyTemplate={applyTemplate}
          template={template}
          key={template.template_id}
        />
      ))}
    </div>
  );
};

export default TemplatesList;
