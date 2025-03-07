 define("SrmApprovalServiceConstants", [], function() {
	return {
		/**
		 * Статус артефакта.
		 */
		SrmArtifactStatus: {
			/** Статус "Новый". */
			New: "86c0af47-a993-4754-b975-68614d06344f",
			/** Статус "На доработке". */
			OnRevision: "68a20c16-dca9-44b6-b1bf-6ca60f3efa80",
			/** Статус "На согласовании". */
			OnAppoval: "0605f699-dbb0-4196-82fc-98ced2593b0c",
			/** Статус "Отклонен". */
			Rejected: "e35adb85-4801-4e76-b18e-0cd32d41b208",
			/** Статус "Отменен". */
			Canceled: "b7e5e0fd-aa76-4718-9a03-7616bf176586",
			/** Статус "Согласован". */
			Approved: "fb3aa585-dc44-4f09-9cf6-2ff01652336b"
		}
	 };
 });