import SprintCreationForm from "../_components/create-sprint";
import SprintBoard from "../_components/sprint-board";
import "../../organization/[orgId]/_components/notfound.css";

export default function SprintPage(params) {
  const { projectId, project } = params;

  return (
    <div className="container mx-auto">
      <SprintCreationForm
        sprints={project.sprints}
        projectTitle={project.name}
        projectId={projectId}
        projectKey={project.key}
        sprintKey={project.sprints?.length + 1}
      />

      {project.sprints.length > 0 ? (
        <SprintBoard
          sprints={project.sprints}
          projectId={projectId}
          orgId={project.organizationId}
        />
      ) : (
        <section className="page_404 mt-4">
          <div className="container">
            <div className="row">
              <div className="col-sm-12 ">
                <div className="col-sm-10 col-sm-offset-1  text-center">
                  <div className="four_zero_four_bg">
                    <h1 className="text-outline text-center bg-gradient-to-r from-violet-800 to-zinc-400 bg-clip-text text-transparent">
                      Oops !
                    </h1>
                  </div>

                  <div className="contant_box_404 text-gray-900">
                    You have to create a sprint from above button
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
