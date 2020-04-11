import Listr, { ListrTask } from 'listr';
import { createObservableProcess, ObservableProcess } from "observable-process"
import { Observable, merge } from 'rxjs'
import { first, skip } from 'rxjs/Operators';

console.clear()

const registry: [string, () => ObservableProcess][] = [
    ["project1", () => createObservableProcess(["ts-node", "./commands/run-webpack", "./index.js"])],
    ["project2", () => createObservableProcess(["ts-node", "./commands/run-webpack", "./another-project.js"])]
]

const processes: (() => [Observable<any>, ListrTask])[] = registry.map(project => () => {

    const p = project[1]() as ObservableProcess;
    const processObservable = new Observable<any>(observer => {
        p.stdout.on("data", function () {
            observer.next("")
        });
    })

    return [
        processObservable,
        { title: project[0], task: () => processObservable.pipe(first()).toPromise() }
    ]
});

// const observable = createObservableProcess(["ts-node", "./commands/run-webpack", "./index.js"])
// const observable1 = createObservableProcess(["ts-node", "./commands/run-webpack", "./another-project.js"])

let updates = new Observable();

const listrTasks = processes.map(p => {
    const definition = p();
    updates = merge(updates, definition[0])
    return () => definition[1];
})

const newListr = () => new Listr([
    { title: "Blah", task: () => Promise.resolve() }
]);

updates.subscribe(_ => {
    // TODO this hits but we have to figure out how to
    // reload the current session
    // it seems since the session is locked by webpack, we cant just
    // redraw a new listr
    debugger;
})

new Listr(listrTasks.map(t => t()), { concurrent: true }).run();
// new Listr(processes.map(p => p()[1]), { concurrent: true }).run();