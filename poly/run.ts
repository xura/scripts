import Listr, { ListrTask } from 'listr';
import { createObservableProcess, ObservableProcess } from "observable-process"
import { Observable, merge } from 'rxjs'
import { first, skip } from 'rxjs/Operators';

console.clear()

const registry: [string, () => ObservableProcess][] = [
    ["project1", () => createObservableProcess(["ts-node", "./commands/run-webpack", "./index.js", "project1"])],
    ["project2", () => createObservableProcess(["ts-node", "./commands/run-webpack", "./another-project.js", "project2"])]
]

const processes: (() => [Observable<any>, ListrTask])[] = registry.map(project => () => {

    const p = project[1]() as ObservableProcess;
    const processObservable = new Observable<any>(observer => {
        p.stdout.on("data", function () {
            const output = p.stdout.fullText().split("\n");
            observer.next([
                project[0],
                output[output.length - 2]
            ])
        });
    })

    return [
        processObservable,
        { title: project[0], task: () => processObservable.pipe(first()).toPromise() }
    ]
});

let updates = new Observable();

const listrTasks = processes.map(p => {
    const definition = p();
    updates = merge(updates, definition[0])
    return () => definition[1];
})

const newListr = (tasks: ListrTask[]) => new Listr(tasks, {
    concurrent: true,
    exitOnError: false
}).run();

const errors: any = {};

const subscribe = () => updates.subscribe((stdout: any) => {

    console.clear();
    const [project, message] = stdout;

    errors[project] = message !== "null";

    newListr(registry.map(p => ({
        title: p[0],
        task: () =>
            errors[p[0]] === true
                ? Promise.reject(new Error("Failed"))
                : Promise.resolve()
    }))).catch(e => { })
})

new Listr(listrTasks.map(t => t()), {
    concurrent: true,
    exitOnError: false
}).run().then(
    _ => subscribe()
);