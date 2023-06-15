import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, FieldError } from "react-hook-form";
import { FormSchema, formSchema } from "./schema";
import { ComponentProps, Ref, forwardRef } from "react";

function App() {
	const { handleSubmit, control } = useForm<FormSchema>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			start: { hour: "", minute: "" },
			end: { hour: "", minute: "" },
		},
	});

	const onSubmit = handleSubmit(
		(data) => console.log({ data }),
		(error) => console.log({ error }),
	);

	return (
		<div className="w-screen h-screen p-8 flex justify-center items-center">
			<form className="flex space-x-4 items-center" onSubmit={onSubmit}>
				<Controller
					name="start.hour"
					control={control}
					render={({ field, fieldState }) => (
						<MyInput
							{...field}
							placeholder="start hh"
							className="form-input"
							error={fieldState.error}
						/>
					)}
					// NOTE: Use [deps](https://react-hook-form.com/docs/useform/register#options) to watch `start.minute` changes
					rules={{ deps: ["start.minute"] }}
				/>
				<span> : </span>
				<Controller
					name="start.minute"
					control={control}
					render={({ field, fieldState }) => (
						<MyInput
							{...field}
							placeholder="start mm"
							className="form-input"
							error={fieldState.error}
						/>
					)}
					rules={{ deps: ["start.hour"] }}
				/>
				<span> | </span>
				<Controller
					name="end.hour"
					control={control}
					render={({ field, fieldState }) => (
						<MyInput
							{...field}
							placeholder="end hh"
							className="form-input"
							error={fieldState.error}
						/>
					)}
					rules={{ deps: ["end.minute"] }}
				/>
				<span> : </span>
				<Controller
					name="end.minute"
					control={control}
					render={({ field, fieldState }) => (
						<MyInput
							{...field}
							placeholder="end mm"
							className="form-input"
							error={fieldState.error}
						/>
					)}
					rules={{ deps: ["end.hour"] }}
				/>
				<button type="submit" className="form-input self-end">
					Submit
				</button>
			</form>
		</div>
	);
}

const MyInput = forwardRef(
	(
		props: ComponentProps<"input"> & { error?: FieldError },
		ref: Ref<HTMLInputElement>,
	) => {
		return (
			<div className="block space-y-2">
				<input className="form-input" {...props} ref={ref} />
				<div className="absolute w-48 text-red-500">{props.error?.message}</div>
			</div>
		);
	},
);

export default App;
