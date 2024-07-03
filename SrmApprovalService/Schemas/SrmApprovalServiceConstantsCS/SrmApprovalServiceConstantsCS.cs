namespace BPMSoft.Common
{
	using System;

	/// <summary>
	/// Константные значения C# пакета SrmApprovalService.
	/// </summary>
	public static class SrmApprovalServiceConstantsCS
	{
		/// <summary>
        /// Шаблон сообщения.
        /// </summary>
		public static class EmailTemplate
		{
			/// <summary>
			/// Шаблон письма для отправки Согласующему Сервиса согласования (RU).
			/// </summary>
			public static Guid SendApprovalRequest { get; } = new Guid("05bc140f-38c6-4c3e-a798-f1fdf3fce08e");
		}
		
		/// <summary>
        /// Результаты согласования.
        /// </summary>
        public static class SrmVisaResult
		{
			/// <summary>
			/// Возвращено на доработку.
			/// </summary>
			public static Guid ReturnedForRework { get; } = new Guid("b2bc0dc6-e5cf-4f81-a708-3726669d7b5e");
			
			/// <summary>
			/// Согласовано.
			/// </summary>
			public static Guid Reconciled { get; } = new Guid("8b317a82-dfec-463d-b7a7-8ede44829ceb");
			
			/// <summary>
			/// Отменено.
			/// </summary>
			public static Guid Canceled { get; } = new Guid("d108a815-c4a9-4941-97ea-0d3dd6f96f08");
		}
		
		/// <summary>
        /// Статус визы.
        /// </summary>
        public static class VisaStatus
		{
            /// <summary>
            /// Завершена.
            /// </summary>
            public static Guid End { get; } = new Guid("869be55f-a29b-4dba-9feb-5bcd852eca29");
			
			/// <summary>
            /// Отменена.
            /// </summary>
            public static Guid Canceled { get; } = new Guid("9120fdef-69be-4168-b5f3-517714b7a4e9");
			
			/// <summary>
            /// В работе.
            /// </summary>
            public static Guid InProgress { get; } = new Guid("bc4f01cf-6e2b-415e-9d85-87c6cfda18ca");
			
		} 
		
		/// <summary>
        /// Тип поля объекта согласования.
        /// </summary>
        public static class SrmFieldType
		{
            /// <summary>
            /// Целое число.
            /// </summary>
            public static Guid Integer = new Guid("a01f8e1b-adcc-4ac2-b37a-6f83c278fd48");
			
			/// <summary>
            /// Дробное число.
            /// </summary>
            public static Guid Float = new Guid("473c1ec5-bbf6-4b2a-8a3e-43a4663331a0");
			
			/// <summary>
            /// Логический.
            /// </summary>
            public static Guid Boolean = new Guid("8028e824-46aa-4bcc-91b0-6858fa1953bb");
			
			/// <summary>
            /// Строка.
            /// </summary>
            public static Guid String = new Guid("bf19fe96-3fed-49f6-811a-4d8ab9df5d4e");
			
			/// <summary>
            /// Справочник.
            /// </summary>
            public static Guid Lookup = new Guid("af150d86-0cb6-4c1c-bf23-da7eb62e0ec9");
		}

		/// <summary>
        /// Тип согласующего.
        /// </summary>
        public static class SrmReconcilingType
		{
            /// <summary>
            /// Основной.
            /// </summary>
            public static Guid Main { get; } = new Guid("22907bf3-26d3-46f9-8e88-d0c70be62439");
			
			/// <summary>
            /// Дополнительный.
            /// </summary>
            public static Guid Additional { get; } = new Guid("a6ae57ab-adc7-4fc3-81ca-630e10747f8d");
		}

		/// <summary>
		/// Оператор сравнения.
		/// </summary>
		public static class SrmComparisonOperator
		{
			/// <summary>
			/// Равенство.
			/// </summary>
			public static Guid Equal { get; } = new Guid("24f6afe8-f65c-4ea1-92e1-284bf8cd98ee");

            /// <summary>
            /// Больше.
            /// </summary>
            public static Guid Greater { get; } = new Guid("e920f6cf-0aa2-4693-a35c-b4a53e4659f8");
			
			/// <summary>
            /// Больше или равно.
            /// </summary>
			public static Guid GreaterOrEqual { get; } = new Guid("c9533443-860d-4101-866b-b7f35f176117");
			
			/// <summary>
            /// Меньше.
            /// </summary>
			public static Guid Less { get; } = new Guid("5f9cac50-7036-435f-ae2f-d899af16518b");
			
			/// <summary>
            /// Меньше или равно.
            /// </summary>
			public static Guid LessOrEqual { get; } = new Guid("fce44333-1bc2-466a-94ce-8a79ef346f83");
			
			/// <summary>
            /// Заполнено.
            /// </summary>
			public static Guid NotEmpty { get; } = new Guid("b2ca94fe-ee9d-43a3-8dcd-6755aaf9f7a9");
			
			/// <summary>
            /// Не заполнено.
            /// </summary>
			public static Guid Empty { get; } = new Guid("659177d5-d2c0-4e03-865b-84f20be2728c");
		}
	}
}